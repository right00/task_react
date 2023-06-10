import { TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Table from '@mui/material/Table/Table';
import React, { FC, useEffect } from 'react';
import styled from 'styled-components';

type task = {
    id: number,
    taskName: string,
    taskTime: number,
    taskStatus: 'todo' | 'doing' | 'done';
    createdAt: string,
    updatedAt: string,
    limitAt: string,
}

type sortColumn = {
    column: 'id' | 'taskName' | 'taskTime' | 'taskStatus' | 'createdAt' | 'updatedAt' | 'limitAt',
    order: 'asc' | 'desc',
}

type InputPartProps = {
    rows: task[],
    saveRows: (rows: task[]) => void,
    className?: string,
}

type TablePartProps = {
    rows: task[],
    saveRows: (rows: task[]) => void,
    className?: string,
}

// sortColumnを受け取って、columnをソートする関数
const sortRows = (rows:task[], sortColumn:sortColumn) => {
    const newRows = rows.slice();
    newRows.sort((a, b) => {
        if (sortColumn.order === 'asc') {
            if (a[sortColumn.column] < b[sortColumn.column]) {
                return -1;
            } else {
                return 1;
            }
        } else {
            if (a[sortColumn.column] < b[sortColumn.column]) {
                return 1;
            } else {
                return -1;
            }
        }
    });
    return newRows;
}

// taskのidをkeyとして、taskStatusを変更する関数
const changeTaskStatus = (
    rows:task[],
    saveRows: (rows: task[]) => void,
    id:number,
    taskStatus:"todo" | "doing" | "done",
    ) => {
    const newRows = rows.map((row) => {
        if (row.id === id) {
            return {
                ...row,
                taskStatus: taskStatus,
            };
        } else {
            return row;
        }
    });
    saveRows(newRows);
};

// date型をstring型に変換する関数 形式 : MM-DD-YYYY
const formatDate = (date:Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`
}

// ローカルストレージにtaskを保存する
const saveTask = (rows:task[]) => {
    localStorage.setItem("task", JSON.stringify(rows));
}

// ローカルストレージからtaskを取得する
const loadTask = ()=> {
    const task = localStorage.getItem("task");
    if (task === null) {
        return undefined;
    }
    return JSON.parse(task);
}

// sortColumnを受け取って、rowsをソートするリンクを表示するコンポーネント
const SortLink:FC<{sortColumn:sortColumn, setSortColumn: (sortColumn: sortColumn) => void}> = (props) => {
    const sortColumn = props.sortColumn;
    const setSortColumn = props.setSortColumn;

    const handleClick = () => {
        if (sortColumn.order === 'asc') {
            setSortColumn({
                column: sortColumn.column,
                order: 'desc',
            });
        } else {
            setSortColumn({
                column: sortColumn.column,
                order: 'asc',
            });
        }
    };

    return (
        <a href="#" onClick={handleClick}>
            {sortColumn.order === 'asc' ? '▲' : '▼'}
        </a>
    );
}

// taskのidをを受け取って、taskStatusをプルダウンで表示・変更ができるコンポーネント
const TaskStatusSelect:FC<{id:number, taskStatus:"todo" | "doing" | "done", rows:task[], saveRows: (rows: task[]) => void}> = (props) => {
    const id = props.id;
    const taskStatus = props.taskStatus;
    const saveRows = props.saveRows;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        changeTaskStatus(props.rows, saveRows, id, e.target.value as "todo" | "doing" | "done");
    };

    return (
        <select value={taskStatus} onChange={handleChange}>
            <option value="todo">todo</option>
            <option value="doing">doing</option>
            <option value="done">done</option>
        </select>
    );
};

// taskのidをを受け取って、taskをボタンで削除できるコンポーネント
const DeleteButton:FC<{className?:string,id:number, rows:task[], saveRows: (rows: task[]) => void}> = (props) => {
    const id = props.id;
    const saveRows = props.saveRows;

    const handleClick = () => {
        const newRows = props.rows.filter((row) => row.id !== id);
        saveRows(newRows);
    };

    return (
        <button onClick={handleClick}>削除</button>
    );
};


const TablePart:FC<TablePartProps> = (props:TablePartProps) => {
    const rows = props.rows;
    const className = props.className;
    const setSortColumn = (sortColumn: sortColumn) => {
        const newRows = sortRows(rows, sortColumn);
        props.saveRows(newRows);
    };
    
    return (                
    <Table className={className} sx={{ minWidth: 650 ,maxWidth: 800 , border: 1, borderRadius : "5px"}} aria-label="simple table">
        <TableHead>
            <TableRow>
            <TableCell>
                タスク id
                <SortLink sortColumn={{column: 'id', order: 'asc'}} setSortColumn={setSortColumn} />
                <SortLink sortColumn={{column: 'id', order: 'desc'}} setSortColumn={setSortColumn} />
            </TableCell>
            <TableCell>タスク名</TableCell>
            <TableCell align="right">
                タスク時間
                <SortLink sortColumn={{column: 'taskTime', order: 'asc'}} setSortColumn={setSortColumn} />
                <SortLink sortColumn={{column: 'taskTime', order: 'desc'}} setSortColumn={setSortColumn} />
            </TableCell>
            <TableCell align="right">
                タスク状態
                <SortLink sortColumn={{column: 'taskStatus', order: 'asc'}} setSortColumn={setSortColumn} />
                <SortLink sortColumn={{column: 'taskStatus', order: 'desc'}} setSortColumn={setSortColumn} />
            </TableCell>
            <TableCell align="right">
                作成日
                <SortLink sortColumn={{column: 'createdAt', order: 'asc'}} setSortColumn={setSortColumn} />
                <SortLink sortColumn={{column: 'createdAt', order: 'desc'}} setSortColumn={setSortColumn} />
            </TableCell>
            <TableCell align="right">
                更新日
                <SortLink sortColumn={{column: 'updatedAt', order: 'asc'}} setSortColumn={setSortColumn} />
                <SortLink sortColumn={{column: 'updatedAt', order: 'desc'}} setSortColumn={setSortColumn} />
            </TableCell>
            <TableCell align="right">
                期限日
                <SortLink sortColumn={{column: 'limitAt', order: 'asc'}} setSortColumn={setSortColumn} />
                <SortLink sortColumn={{column: 'limitAt', order: 'desc'}} setSortColumn={setSortColumn} />
            </TableCell>
            <TableCell align="right">
                削除
            </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {rows.map((row) => (
            // taskの各要素を表示する
            <TableRow
                className={'TableRow '+row.taskStatus}
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell component="th" scope="row">
                    {row.id}
                </TableCell>
                <TableCell component="th" scope="row">
                {row.taskName}
                </TableCell>
                <TableCell align="right">{row.taskTime}</TableCell>
                <TableCell align="right"><TaskStatusSelect id={row.id} taskStatus={row.taskStatus} rows={rows} saveRows={props.saveRows} /></TableCell>
                <TableCell align="right">{row.createdAt}</TableCell>
                <TableCell align="right">{row.updatedAt}</TableCell>
                <TableCell align="right">{row.limitAt.toLocaleString()}</TableCell>
                <TableCell align="right"><DeleteButton className="deleteButton" id={row.id} rows={rows} saveRows={props.saveRows} /></TableCell>
            </TableRow>
            ))}
        </TableBody>
    </Table>)
}

const StyledTablePart = styled(TablePart)`
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
    border: 1px solid #000;
    border-radius: 5px;
    width: 800px;
    height: auto;
    overflow: scroll;
    display: block;
    text-align: center;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    .TableRow {
        &:nth-child(odd) {
            background-color: #eee;
        }
        height: 50px;
    }
    .TableRow.todo {
        background-color: #8cc;
    }
    .TableRow.doing {
        background-color: #fff;
    }
    .TableRow.done {
        background-color: #ccc;
    }
    .deleteButton {
        background-color: #fff;
        border: 1px solid #000;
        border-radius: 10px;
        width: 50px;
        height: 30px;
        &:hover {
            background-color: #000;
            color: #fff;
        }
    }



`;

// ボタンが押されたとき、taskの要素を各inputで受け取り、rowsに追加する
const InputPart:FC<InputPartProps> = (props:InputPartProps) => {
    const rows = props.rows;
    const saveRows = props.saveRows;
    const className = props.className;

    const [taskName, setTaskName] = React.useState<string>("");
    const [taskStatus, setTaskStatus] = React.useState<"todo" | "doing" | "done">("todo");
    const [limitAt, setLimitAt] = React.useState<Date>(new Date());

    const Now = () => {
        return new Date();
    };

    const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskName(e.target.value);
    };
    const handleTaskStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskStatus(e.target.value as "todo" | "doing" | "done");
        e.target.value = "todo";
    };
    const handleLimitAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLimitAt(new Date(e.target.value));
    };

    const handleAddTask = (
        rows:task[],
        saveRows: (rows: task[]) => void,
        taskName:string,
        taskTime:number,
        taskStatus:"todo" | "doing" | "done" ,
        createdAt:Date,
        updatedAt:Date,
        limitAt:Date,
        setTaskName: (taskName:string) => void,
        setTaskStatus: (taskStatus:"todo" | "doing" | "done") => void,
        setLimitAt: (limitAt:Date) => void,
        ) => {
        const newTask = {
            id: rows.length + 1,
            taskName: taskName,
            taskTime: taskTime,
            taskStatus: taskStatus,
            createdAt: formatDate(createdAt),
            updatedAt: formatDate(updatedAt),
            limitAt: formatDate(limitAt),
        };
        saveRows([...rows, newTask]);
        setTaskName("");
        setTaskStatus("todo");
        setLimitAt(new Date());
    }
    
    return ( 
        <div className={className}>
            <div className='InputRow'>
                <span className='InputContents'>タスク名 :</span>
                <input className='InputContents' type="text" value={taskName} onChange={handleTaskNameChange} />
            </div>
            <div className='InputRow'>
                <span className='InputContents' >タスク状態 :</span>
                <input className='InputContents 'type="radio" value="todo" checked={taskStatus === "todo"} onChange={handleTaskStatusChange} />todo
                <input className='InputContents' type="radio" value="doing" checked={taskStatus === "doing"} onChange={handleTaskStatusChange} />doing
                <input className='InputContents' type="radio" value="done" checked={taskStatus === "done"} onChange={handleTaskStatusChange} />done
            </div>
            <div className='InputRow'>
                <span className='InputContents' >期限日 :</span>
                <input className='InputContents' type="Date" value={formatDate(limitAt)} onChange={handleLimitAtChange} />
            </div>
            <div>
                <button onClick={() => handleAddTask(rows, saveRows, taskName, 0, taskStatus, Now(), Now(), limitAt, setTaskName, setTaskStatus, setLimitAt)}>追加</button>
            </div>
        </div>
    )
}

// 入力の要素は横並びにする　間隔は20px　borderは1px solid #000　border-radiusは5px　ボタンはblock要素にする
const StyledInputPart = styled(InputPart)`
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
    border: 1px solid #000;
    border-radius: 5px;
    width: 800px;
    height: 300px;
    display: block;
    text-align: left;
    background-color: #fff;
    .InputRow {
        margin: 20px;
    }
    .InputContents {
        margin-right: 20px;
    }
    button {
        display: block;
        margin: 0 auto;
        margin-top: 20px;
        width: 150px;
        height: 50px;
        border-radius: 10px;
        background-color: #ff7;
    }
`;


const MainContainer = (className:string|undefined) => {
    const startData = loadTask();
    const [rows, setRows] = React.useState<task[]>([]);

    useEffect(() => {
    if (startData !== undefined ){
        setRows(startData);
    }
    }, [startData]);

    const saveRows = (rows:task[]) => {
        saveTask(rows);
        setRows(rows);
    };

    


    return ( 
            <div className={className}>
                <div>
                    <StyledInputPart rows={rows} saveRows={saveRows} />
                </div>
                <div>
                    <StyledTablePart rows={rows} saveRows={saveRows} />
                </div>
            </div>
        )
}


const styledMainContainer = styled(MainContainer)`
    margin: 0 auto;
    margin-top: 20px;
    margin-bottom: 20px;
    border: 1px solid #000;
    border-radius: 5px;
    width: 800px;
    height: 800px;
    display: block;
    text-align: center;
    background-color: #fff;
`;

export const Main = styledMainContainer;
