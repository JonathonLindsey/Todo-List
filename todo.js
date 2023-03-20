const fs = require('fs');
const yargs = require('yargs');

const todoFile = yargs.argv.file;
const todoAction = yargs.argv._[0];

function readTodos() {
  return new Promise((resolve, reject) => {
    fs.readFile(todoFile, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
}

function writeTodos(todos) {
  return new Promise((resolve, reject) => {
    fs.writeFile(todoFile, JSON.stringify(todos), 'utf8', (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function addTodo() {
  const todoText = yargs.argv.add;
  if (!todoText) {
    console.error('Error: Missing --add parameter');
    printUsage();
    return;
  }

  readTodos()
    .then((todos) => {
      const todo = {
        id: new Date().getTime(),
        text: todoText,
        createdDate: new Date(),
      };
      todos.push(todo);
      return writeTodos(todos);
    })
    .then(() => {
      console.log(`Added TODO: ${todoText}`);
    })
    .catch((err) => {
      console.error(err);
    });
}

function deleteTodo() {
  const todoId = yargs.argv.delete;
  if (!todoId) {
    console.error('Error: Missing --delete parameter');
    printUsage();
    return;
  }

  readTodos()
    .then((todos) => {
      const todoIndex = todos.findIndex((todo) => todo.id == todoId);
      if (todoIndex === -1) {
        console.error(`Error: TODO with ID ${todoId} not found`);
        return;
      }
      todos.splice(todoIndex, 1);
      return writeTodos(todos);
    })
    .then(() => {
      console.log(`Deleted TODO with ID: ${todoId}`);
    })
    .catch((err) => {
      console.error(err);
    });
}

function listTodos() {
  readTodos()
    .then((todos) => {
      console.log('TODO List:');
      todos.forEach((todo) => {
        console.log(`- ${todo.id}: ${todo.text} (Created: ${todo.createdDate})`);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

function printUsage() {
  console.log('Usage: node todo.js --add "My new TODO" --file todoList');
  console.log('       node todo.js --delete 2 --file todoList');
  console.log('       node todo.js --list --file todoList');
  console.log('');
  console.log('Options:');
  console.log('  --add\t\tAdd a new TODO');
  console.log('  --delete\tDelete an existing TODO by ID');
  console.log('  --list\tList all existing TODOs');
  console.log('  --file\tPath to the file to read/write TODOs');
}

if (!todoFile) {
  console.error('Error: Missing --file parameter');
  printUsage();
  process.exit(1);
}

if (!fs.existsSync(todoFile)) {
  if (todoAction !== 'add') {
    console.error(`Error: File ${todoFile} does not exist`);
    printUsage();
    process.exit(1);
  }
  fs.writeFileSync(todoFile, '[]');
}

if (todoAction === 'add');




