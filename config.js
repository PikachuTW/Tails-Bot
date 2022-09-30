const config = {

    settings: {
        prefix: 't!',
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
            check: (member) => {
                try {
                    if (member.roles.cache.has('832213672695693312')) return true;
                } catch (e) {
                    return false;
                }
            },
        },

        {
            level: 2,
            name: 'Admin',
            check: (member) => {
                try {
                    if (member.roles.cache.has('856377783163944970')) return true;
                } catch (e) {
                    return false;
                }
            },
        },

        {
            level: 3,
            name: 'Owner',
            check: (member) => {
                try {
                    if (member.roles.cache.has('870741338960830544')) return true;
                } catch (e) {
                    return false;
                }
            },
        },
        {
            level: 4,
            name: 'Highest',
            check: (member) => {
                try {
                    if (member.roles.cache.has('872356312296591400')) return true;
                } catch (e) {
                    return false;
                }
            },
        },

        {
            level: 5,
            name: 'Tails',
            check: (member) => member.id === '650604337000742934' || member.id === '917380616725594132',
        },
    ],
};

module.exports = config;
