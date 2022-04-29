const intervalId = setInterval(() => {
  console.log('James'); // 1, 5
}, 10);

setTimeout(() => {
  const promise = new Promise((resolve) => {
    console.log('Richard'); // 2
    resolve('Robert'); // 4
  });

  promise
      .then((value) => {
        console.log(value);

        setTimeout(() => {
          console.log('Michael'); // 6

          clearInterval(intervalId);
        }, 10);
      });

  console.log('John'); // 3
}, 10);

// 1 James - (реальная задержка между вызовами функции с помощью setInterval меньше,
// чем указано в коде, а т.к. delay у setTimeout и setInterval одинаковый,
//  то быстрее выполнится setInterval)
// 2 Richard - (этот вывод располагается в конструкторе промиса и выполняется немедленно,
// а промис добавляется в очередь microtasks)
// 3 John - этот вывод последний в синхронном выполнении
// 4 Robert - очередь microtasks приоритетнее очереди tasks, куда попал setTimeout,
// поэтому промис резолвится первым, и в консоль
// выводится значение переданное в .then(). Тут же в .then() заводится новый setTimeout,
// который попадает в tasks. Завершаем выполнение промиса,
// удаляем задачу из microtasks. Завершаем выполнение первого setTimeout, удаляем его из tasks.
// 5 James - у setTimeout, созданного в промисе delay такой же, что и setInterval,
// поэтому setInterval успевает выполниться еще раз
// 6 Michael - очередь microtasks пустая, идем в tasks, там второй setTimeout.
// Выводим в консоль имя оттуда, очищаем setInterval.
