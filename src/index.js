const init = () => {

  let inEditMode = false
  let colors = []
  let formData = {
    color: '',
    code: ''
  }
  let selectedColor = {
    id: '',
    color: '',
    code: ''
  }


  const message = document.getElementById('message')
  const cube = document.getElementById('cube')
  const list = document.getElementById('list')
  const form = document.getElementById('form')

  fetchColors()

  function renderCube(colorObj) {

    const colorObjItems = {
      ...colorObj,
      color: colorObj.color,
      code: colorObj.code
    }
    console.log(colorObjItems)
    const cubeHtml =
      `<h1 id="${code}" class="sphere"></h1>`
  }

  function renderList(data) {

    const colorList = data.map(item => (
      `<tr>
        <td>${item.id}</td>
        <td>${item.color}</td>
        <td>${item.code}</td>
        <td>
          <button type="button" id="${item.id}" class="item-btn" name="view">
            View
          </button>
        </td>
        <td>
          <button type="button" id="${item.id}" class="item-btn" name="edit">
            Edit
          </button>
        </td>
        <td>
          <button type="button" id="${item.id}" class="item-btn" name="del">
            Del
          </button>
        </td>
      </tr>`
    )).join('')

    const listHtml =
      `<table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Color</th>
            <th>HEX</th>
            <th>V</th>
            <th>E</th>
            <th>D</th>
          </tr>
        </thead>
        <tbody>
          ${colorList}
        </tbody>
      </table>`

    list.innerHTML = listHtml
  }

  async function fetchColors() {
    try {
      const r = await fetch(`http://localhost:3000/colors`)
      if (!r.ok) {
        throw new error('bad fetch in GET')
      }
      const data = await r.json()
      colors = data
      renderList(data)
    } catch (error) { console.error(error) }
  }


}

window.addEventListener("DOMContentLoaded", init)