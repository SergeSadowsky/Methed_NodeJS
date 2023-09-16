class UserInterface {
    constructor(toDoList){
        this._list = toDoList;
    }

    add(str){
        try {
            const task = this._list.add(str);
            console.log(`Задача с идентификатором ${task.id} добавлена.`);
        } catch (error) {
            console.error(error.message);
        };
    }

    list(){
        const tasks = this._list.list;
        if(tasks.length > 0) {
            console.log('Список задач:');
            tasks.forEach(element => 
                console.log(`${element.id}. [${element.status}] ${element.task}`));
        } else {
            console.log('Список задач пуст');
        };
    }

    update({id, str}){
        if(id && str){
            try {
                const task = this._list.update(id, str)
                console.log(`Задача с идентификатором ${task.id} обновлена`);
            } catch (error) {
                console.error(error.message);
            }
            return;
        };
        this.help();
    }

    get(taskId){
        try {
            const {id, task, status} = this._list.get(taskId);
            console.log(`Задача с идентификатором ${id}:`);
            console.log(`Название: ${task}`);
            console.log(`Статус: ${status}`);
        } catch (error) {
            console.error(error.message);
        }
    }

    status({id, str}){
        if(id && str){
            try {
                const task = this._list.status(id, str);
                console.log(`Статус задачи с идентификатором ${task.id} обновлен`);
            } catch (error) {
                console.error(error.message);
            }
            return;
        };
        this.help();
    }

    delete(id){
        try {
            this._list.delete(id);
            console.log(`Задача с идентификатором ${id} удалена.`);
        } catch (error) {
            console.error(error.message);
        }        
    }

    help(){
        console.log(`
        -h --help               : список команд
        add <task>              : добавить новую задачу.
        list                    : вывести список всех задач.
        get <id>                : вывести информацию о задаче с указанным идентификатором.
        update <id> "<newTask>"   : обновить задачу с указанным идентификатором.
        status <id> "<newStatus>" : обновить статус задачи с указанным идентификатором.
                                : допустимые значения status - В работе, Выполнена
        delete <id>             : удалить задачу с указанным идентификатором.
      `);
      return;
    }
}

const userInterface = (toDoList) => new UserInterface(toDoList);

export default userInterface;