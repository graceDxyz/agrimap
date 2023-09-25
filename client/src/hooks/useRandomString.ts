import { useState } from "react";

function useRandomString(length: number): [string, () => string] {
  const charset =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  const generateRandomString = (): string => {
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }
    return result;
  };

  const initialString = generateRandomString();

  const [randomString, setRandomString] = useState<string>(initialString);

  const regenerateRandomString = () => {
    const newRandomString = generateRandomString();
    setRandomString(newRandomString);
    return newRandomString;
  };

  return [randomString, regenerateRandomString];
}

export default useRandomString;
