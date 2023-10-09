import { QUERY_REPORT_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const getCurrentYear = () => {
  const currentDate = new Date();
  return currentDate.getFullYear();
};

export function useGetExcelReport({ token }: { token: string }) {
  return useMutation({
    mutationKey: [QUERY_REPORT_KEY],
    mutationFn: async () => {
      const response = await api.get("/report", {
        responseType: "blob", // Specify the response type as a blob
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType =
        response.headers["Content-Type"] ??
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const filename =
        response.headers["content-disposition"] ??
        `Report-${getCurrentYear()}.xlsx`;

      const blob = new Blob([response.data], {
        type: contentType as string,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename; // Set the filename with the current year
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });
}
