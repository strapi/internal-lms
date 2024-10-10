export const getAuthData = (): string | null => {
  const token = localStorage.getItem("jwt");
  return token;
};
