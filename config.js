const config = {

    settings: {
        prefix: 't!',
    },

    whitelist: {
        leader: ['650604337000742934', '831915586555740181', '886967562867449856'],
    },

    benefitsdisplay: {
        cooldownReduce: ['無', '-30s', '-1min', '-1min 40s', '-2min 30s', '-3min 30s', '-5min', '-6min'],
        investMulti: ['無', 'x1.1', 'x1.2', 'x1.4', 'x1.75', 'x2', 'x2.5', 'x3'],
        commandCost: ['無', 'x0.9', 'x0.8', 'x0.6', 'x0.5', 'x0.4', 'x0.2', 'x0.1'],
        giveTax: ['無', '9 % ', '8 % ', '6 % ', '5 % ', '4 % ', '2 % ', '1 % '],
        doubleChance: ['無', '1%', '2%', '5%', '10%', '15%', '25%', '35%'],
    },

    benefitsdata: {
        cooldownReduce: [0, 30000, 60000, 100000, 150000, 210000, 300000, 360000],
        investMulti: [1, 1.1, 1.2, 1.4, 1.75, 2, 2.5, 3],
        commandCost: [1, 0.9, 0.8, 0.6, 0.5, 0.4, 0.2, 0.1],
        giveTax: [0.1, 0.09, 0.08, 0.06, 0.05, 0.04, 0.02, 0.01],
        doubleChance: [0, 0.01, 0.02, 0.05, 0.1, 0.15, 0.25, 0.35],
    },

    permLevels: [
        {
            level: 0,
            name: 'User',
            check: () => true,
        },

        {
            level: 1,
            name: 'Staff',
            check: (message) => {
                try {
                    if (message.member.roles.cache.has('832213672695693312')) return true;
                }
                catch (e) {
                    return false;
                }
            },
        },

        {
            level: 2,
            name: 'Mod',
            check: (message) => {
                try {
                    if (message.member.roles.cache.has('854959385901531137')) return true;
                }
                catch (e) {
                    return false;
                }
            },
        },

        {
            level: 3,
            name: 'Admin',
            check: (message) => {
                try {
                    if (message.member.roles.cache.has('856377783163944970')) return true;
                }
                catch (e) {
                    return false;
                }
            },
        },

        {
            level: 4,
            name: 'Co-Owner',
            check: (message) => {
                try {
                    if (message.member.roles.cache.has('854957401362268162')) return true;
                }
                catch (e) {
                    return false;
                }
            },
        },

        {
            level: 5,
            name: 'Leader',
            check: (message) => {
                try {
                    if (message.member.roles.cache.has('926781326202388480')) return true;
                }
                catch (e) {
                    return false;
                }
            },
        },

        {
            level: 6,
            name: 'Owner',
            check: (message) => {
                try {
                    if (message.member.roles.cache.has('870741338960830544')) return true;
                }
                catch (e) {
                    return false;
                }
            },
        },

        {
            level: 7,
            name: 'kanmingli',
            check: (message) => {
                try {
                    if (message.member.roles.cache.has('886670168594477106')) return true;
                }
                catch (e) {
                    return false;
                }
            },
        },

        {
            level: 9,
            name: 'Xi',
            check: (message) => message.author.id === '839123456523763784' || message.author.id === '917380616725594132',
        },

        {
            level: 10,
            name: 'Tails',
            check: (message) => message.author.id === '650604337000742934',
        },
    ],
};

module.exports = config;