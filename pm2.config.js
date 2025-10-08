module.exports = {
    apps: [{
        name: 'Tails Bot',
        script: 'index.js',
        watch: false,
        ignore_watch: ['node_modules', 'enmap', '.git'],
	exec_mode: "cluster",
    }],
};
