const GetTheme = (theme: string) => {
  if (theme === "green") {
    return "border-green-400";
  } else if (theme === "blue") {
    return "border-blue-400";
  } else if (theme === "red") {
    return "border-red-400";
  } else if (theme === "orange") {
    return "border-orange-400";
  } else if (theme === "purple") {
    return "border-purple-400";
  } else if (theme === "gray") {
    return "border-gray-400";
  } else {
    return "border-green-400";
  }
};

export default GetTheme;
