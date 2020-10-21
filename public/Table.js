class Table {
  constructor(selector, options = {}) {
    const el = document.querySelector(selector);
    if (!el) return console.error("Element not found");

    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    table.className = "Table";
    table.append(tbody);
    el.append(table);

    this.table = table;
    this.tbody = tbody;
    this.columns = options.columns || [];
    this.data = options.data || [];
    this.show = options.show || this.columns;
    this.header = options.header || false;
    this.footer = options.footer || false;
    this.footData = options.footData || [];

    this.render();
  }

  addRecords(...records) {
    this.sortedBy = false;
    this.data.push(...records);
    this.tbody.append(
      ...records.map((record) => {
        const tr = document.createElement("tr");
        tr.innerHTML = record.map((val) => `<td>${val}</td>`).join("");
        return tr;
      })
    );
  }

  render() {
    let indices;

    if (this.show.length) {
      indices = this.show.map((name) => this.columns.indexOf(name));
      if (indices.includes(-1)) return console.error("Column not found");
    } else {
      indices = this.columns.length
        ? [...this.columns.keys()]
        : [...Array(this.countColumns()).keys()];
    }

    if (this.header) {
      const thead = this.thead || document.createElement("thead");
      this.thead = thead;
      this.table.prepend(thead);
      thead.innerHTML = `<tr>${indices
        .map((i) => `<th>${this.columns[i]}</th>`)
        .join("")}</tr>`;

      thead.onclick = (e) => {
        const column = e.target.innerText;
        if (e.shiftKey) {
          this.hide(column);
        } else if (e.altKey) {
          this.show = [];
          this.render();
        } else {
          this.sort(column);
        }
      };

      thead.onmousedown = (e) => {
        const column = e.target.innerText;
        thead.classList.add("active");
        e.target.classList.add("active");

        const handleRelease = (e) => {
          if (e.path.includes(thead) && e.target.innerText != column) {
            const targetColumn = e.target.innerText;
            const columns = [...thead.querySelectorAll("th")].map(
              (th) => th.innerText
            );
            const iTarget = columns.indexOf(targetColumn);
            const i = columns.indexOf(column);

            if (iTarget < i)
              this.show = [
                ...columns.slice(0, iTarget),
                column,
                ...columns.slice(iTarget, i),
                ...columns.slice(i + 1),
              ];
            else
              this.show = [
                ...columns.slice(0, i),
                ...columns.slice(i + 1, iTarget + 1),
                column,
                ...columns.slice(iTarget + 1),
              ];

            this.render();
          }

          thead.classList.remove("active");
          document.body.removeEventListener("mouseup", handleRelease);
        };

        document.body.addEventListener("mouseup", handleRelease);
      };
    } else {
      if (this.thead) {
        this.thead.remove();
        delete this.thead;
      }
    }

    if (this.footer) {
      const tfoot = this.tfoot || document.createElement("tfoot");
      this.tfoot = tfoot;
      this.table.append(tfoot);

      tfoot.innerHTML = `<tr>${indices
        .map(
          (i) =>
            `<th>${
              (this.footData.length ? this.footData : this.columns)[i]
            }</th>`
        )
        .join("")}</tr>`;
    } else {
      if (this.tfoot) {
        this.tfoot.remove();
        delete this.tfoot;
      }
    }

    if (this.data) {
      this.tbody.innerHTML = this.data
        .map(
          (record) =>
            `<tr>${indices.map((i) => `<td>${record[i]}</td>`).join("")}</tr>`
        )
        .join("");
    }
  }

  countColumns() {
    if (this.columns.length) return this.columns.length;
    return Math.max(...[...this.tbody.rows].map((row) => row.cells.length));
  }

  hide(name) {
    if (!this.show.length) this.show = this.columns;
    if (this.show.includes(name))
      this.show = this.show.filter((col) => col != name);
    this.render();
  }

  sort(column) {
    const i = this.columns.indexOf(column);
    const isNums = this.data.every((record) => record[i] == +record[i]);

    if (this.sortedBy == column) {
      this.data.reverse();
    } else {
      if (isNums) this.data.sort((a, b) => a[i] - b[i]);
      else this.data.sort((a, b) => (a[i] > b[i] ? 1 : -1));
    }

    this.sortedBy = column;
    this.render();
  }
}
