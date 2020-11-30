for (var i = 1; i <= 100; i ++) {
  if (i % 2 == 0) {
    document.write(`Bim!`);
    if (i % 3 === 0) {
      document.write(`Ok!`);
    }
  } else {
    document.write(`Bum!`);
  }
}