import STATUS from "./constants.js";

class ToDoList{
    constructor(list){
        this._list = list;
        this._changed = false;
    };

    // _createId = () => Math.random().toString().substring(2, 10);

    _createId = () => (this._list[this._list.length -1]?.id || 0) + 1;

    _checkStatus = (status) => Object.values(STATUS)
        .find(el => el.toLowerCase() === status.toLowerCase());        

    add(task) {
        if(task) {
            const taskObj = {
                id: this._createId(),
                status: STATUS.InProcess,
                task: task,
            }; 
            this._list.push(taskObj);
            this._changed = true;
            return(taskObj)
        } else {
            throw new Error(`ADD: Задача не указана`)
        }
    }

    get(id) {
        const index = this._list.findIndex(el => el['id'] === +id);
        if(index != -1) {
            return this._list[index];
        }else {
            throw new Error(`GET: Задача ${id} не обнаружена`)
        }
    }

    delete(id) {
        const index = this._list.findIndex(el => el['id'] === +id);
        if(index != -1) {
            this._list.splice(index, 1)
            this._changed = true;
        } else {
            throw new Error(`DELETE: Задача с идентификатором ${id} не обнаружена`)
        }
    }

    update(id, task) {
        const index = this._list.findIndex(el => el['id'] === +id);
        if(index != -1) {
            this._list[index]['task'] = task;
            this._changed = true;
            return this._list[index]
        } else {
            throw new Error(`UPDATE: Задача ${id} не обнаружена`)
        }
    }

    get list() {
        return this._list;
    }

    get isChanged() {
        return this._changed;
    }

    status(id, status) {
        const index = this._list.findIndex(el => el['id'] === +id);
        if(index != -1) {
            if(this._checkStatus(status)){
                this._list[index]['status'] = status[0].toUpperCase() + status.slice(1).toLowerCase();
                this._changed = true;
                return this._list[index];
            } else {
                throw new Error(`STATUS: Значение ${status} некорректно`);
            };            
        } else {
            throw new Error(`STATUS: Задача ${id} не обнаружена`)
        }
    }
};

const toDoList = (list) => new ToDoList(list);

export default toDoList;