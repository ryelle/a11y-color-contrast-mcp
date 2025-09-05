module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/src"],
	testMatch: ["**/?(*.)+(test).ts", "**/?(*.)+(test).js"],
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				useESM: false,
			},
		],
	},
	moduleFileExtensions: ["ts", "js", "json"],
};
