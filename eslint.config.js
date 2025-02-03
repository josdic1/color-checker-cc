export default [
  {
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        console: "readonly",
        fetch: "readonly"
      },
    },
    rules: {
      "no-undef": "error",          // ❌ Prevents undefined variables
      "no-unused-vars": "warn",     // ⚠️ Warns if a variable is unused
      "no-extra-semi": "error",     // ❌ Catches extra semicolons
      "no-console": "off",          // 🚀 Allows console.log for debugging
      "no-redeclare": "error",      // ❌ Catches redeclared variables
      "object-shorthand": "off",    // ✅ Prevents `{ title, titleVal }` bug
      "no-dupe-keys": "error",      // ❌ Prevents duplicate keys in objects
      "no-implicit-globals": "error"// ✅ Prevents accidental global variables
    },
  },
];
