export const useActiveLink = () => {
    return useState<string>("activeLink", () => "/");
  };
  