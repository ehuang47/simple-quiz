function rollNumber() {
  const set = new Set();
  while (set.size < 10) {
    const r = Math.floor(Math.random() * 20);
    set.add(r);
  }

  console.log(set.values());
}

rollNumber();