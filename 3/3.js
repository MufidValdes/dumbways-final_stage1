function bubbleSort(array) {
  const length = array.length;
  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        // Swap elements
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
  return array;
}

var arr = [2, 24, 32, 22, 31, 100, 56, 21, 99, 7, 5, 37, 97, 25, 13, 11];
let genap = [];
let ganjil = [];


bubbleSort(arr, arr.length);
for (var i = 0; i < arr.length; i++) {
  if (arr[i] % 2 === 0) {
    genap.push(arr[i]);
  } else {
    ganjil.push(arr[i]);
  }
}
console.log("Array :", arr);
console.log("Ganjil :", ganjil);
console.log("Genap :", genap);
