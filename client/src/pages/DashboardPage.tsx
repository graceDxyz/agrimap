import { UploadButton } from "@/lib/uploadthing";

function DashboardPage() {
  return (
    <div className="h-screen w-full">
      hello
      <UploadButton
        endpoint="videoAndImage"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
        onUploadBegin={(name) => {
          // Do something once upload begins
          console.log("Uploading: ", name);
        }}
      />
    </div>
  );
}

// <MapContainer />
export default DashboardPage;
