// add <task>: добавить новую задачу.
// list: вывести список всех задач.
// get <id>: вывести информацию о задаче с указанным идентификатором.
// update <id> <newTask>: обновить задачу с указанным идентификатором.
// status <id> <newStatus>: обновить статус задачи с указанным идентификатором.
// delete <id>: удалить задачу с указанным идентификатором. 

const argsParse = ([, , ...argv], words = []) => {
    const args = {};

    for (const key of words) {
        args[key] = key === argv[0];
        
        if (args[key] && (argv[0] === 'list')) {
            args[key] = argv[0];
        };

        if (args[key] && (argv[0] === 'add' || argv[0] === 'get' || argv[0] === 'delete')) {
            args[key] = argv[1];
        };

        if (args[key] && (argv[0] === 'update' || argv[0] === 'status')) {
            const [, id, str] = argv;
            args[key] = { id, str };
        };
    };

    for (let i = 0; i < argv.length; i++) {
        if (argv[i][0] !== '-') {
          continue;
        };

        if (argv[i].startsWith('-')) {
            if (argv[i].startsWith('--')) {
                args[argv[i].substring(2)] = true;
                continue;
            };
            args[argv[i].substring(1)] = true;
            continue;
        };
    };
    
    return args;
};

export default argsParse;