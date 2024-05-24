module.exports = {
  testEnvironment: "node",
  roots: ["./tests"],
  moduleDirectories: ["node_modules", "../frontend"],
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
  },
  moduleFileExtensions: ["js", "jsx"],
  testPathIgnorePatterns: ["/node_modules/"],
};
