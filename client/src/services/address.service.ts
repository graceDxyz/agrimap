import api from "@/lib/api";

interface Province {
  psgcCode: string;
  name: string;
}

interface City {
  psgcCode: string;
  name: string;
  provinceCode: string;
}

interface Barangay {
  psgcCode: string;
  name: string;
  provinceCode: string;
  cityMunCode: string;
}

export const regionOptions = async (inputValue: string) => {
  const response = await api.get(`/address/province?filter=${inputValue}`);
  const data: Province[] = response.data;
  return data.map((item) => {
    return { ...item, label: item.name, value: item.name };
  });
};

export const cityOptions = async (inputValue: string) => {
  const response = await api.get(`/address/city?filter=${inputValue}`);
  const data: City[] = response.data;
  return data.map((item) => {
    return { ...item, label: item.name, value: item.name };
  });
};

export const barangayOptions = async (inputValue: string) => {
  const response = await api.get(`/address/barangay?filter=${inputValue}`);
  const data: Barangay[] = response.data;
  return data.map((item) => {
    return { ...item, label: item.name, value: item.name };
  });
};
