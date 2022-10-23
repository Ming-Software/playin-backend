import bcryt from "bcrypt";

export const hashPassword = async (password: string) => {
  const salt = await bcryt.genSalt();
  const hash = await bcryt.hash(password, salt);
  return hash;
};

export const checkPassword = async (hash: string, password: string) => {
  const isValid = await bcryt.compare(password, hash);
  return isValid;
};
