module.exports = [
  {
    name: "local",
    script: "./build/src/app.js",
    watch: ["./build"],
    ignore_watch: ["node_modules"],
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "local",
    },
  },
  {
    name: "staging",
    script: "./build/src/app.js",
    watch: ["./build"],
    ignore_watch: ["node_modules"],
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "staging",
    },
  },
  {
    name: "production",
    script: "./build/src/app.js",
    watch: ["./build"],
    ignore_watch: ["node_modules"],
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
    },
  },
];
