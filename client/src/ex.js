export function get_machines_api(page) {
  const page_size = 10;

  // this taking sleep 10
  const response = fetch(
    `https://api.example.com/machines?page=${page}&page_size=${page_size}`
  );

  //   response look like this
  //   {
  //     machines: [machines],
  //     page: page,
  //     page_size: page_size,
  //     total_pages: 1000
  //   }
  return response;
}

export function save_machine(machine) {
  machine = new Machine({ ...machine });
  db.session.add(machine);
  db.session.commit();
}

// ##################################################################################################################

export function fetch_all_machines() {
  let count = 1;
  let response = get_machines_api(1);
  while (count < response.total_pages) {
    response.push(get_machines_api(++count));
  }
  for (let i = 0; i < response[1].total_pages; i++) {
    for (let j = 0; j < response[1].page_size; j++) {
      save_machine(response[i].machines[j]);
    }
  }
}
