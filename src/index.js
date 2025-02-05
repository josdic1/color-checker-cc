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

  function renderForm() {

    const formHtml =
      `<input type="text" id="colorInput" class="form-input" name="color" placeholder="Color name..." />
      <input type="text" id="codeInput" class="form-input" name="code" placeholder="HEX code..." />
      <button type="submit" name="submit" class="form-btn">Go!</button>
      `
    form.innerHTML = formHtml

    // Event Listeners
    document.getElementById('colorInput').addEventListener('input', handleFormInput)

    document.getElementById('codeInput').addEventListener('input', handleFormInput)

    form.addEventListener('submit', handleSubmitClick)

  }

  function handleFormInput(e) {
    const { name, value } = e.target
    formData = {
      ...formData,
      [name]: value
    }
  }

  function handleSubmitClick(e) {
    e.preventDefault()
    if (inEditMode) {
      inEditMode = true
      return;
    } else {
      const newColor = formData
      createColor(newColor)
    }
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
      renderForm()
    } catch (error) { console.error(error) }
  }

  async function createColor(newColor) {
    try {
      const r = await fetch(`http://localhost:3000/colors`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newColor)
      })
      if (!r.ok) {
        throw new error('bad fetch in POST')
      }
      await fetchColors()
    } catch (error) { console.error(error) }
  }


}

window.addEventListener("DOMContentLoaded", init)