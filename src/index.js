const init = () => {

  let inEditMode = false
  let colors = []
  let formData = {
    color: '',
    code: ''
  }
  let filterData = {
    color: '',
    family: 'all'
  }
  let selectedColor = {
    id: '',
    color: '',
    code: ''
  }
  let hex = "#3bb9b3"


  const message = document.getElementById('message')
  const cube = document.getElementById('cube')
  const filter = document.getElementById('filter')
  const list = document.getElementById('list')
  const form = document.getElementById('form')

  fetchColors()


  function renderCube(code) {

    const cubeHtml =
      `<h1 id='sphere' class="fill-text" style="color: ${code}"> ■ ▣ ▧ </h1>`

    cube.innerHTML = cubeHtml
  }

  function renderFilter() {
    const filterHtml =
      ` <h4>Color Filter </h4>
      <label for="colorInputFilter">Color:</label>
      <input type="text" id="colorInputFilter" class="filter-input" name="color" placeholder="Type something..." />
      <label for="familyInputFilter">Type:</label>
    <select id="familyInputFilter" name="family" >
    <option value="all" selected disabled>Choose one...</option>
  <option value='deep-tone'>Deep Tone</option>
<option value='earth-tone'>Earth Tone</option>
<option value='neon'>Neon</option>
<option value='pastel'>Pastel</option>
<option value='primary'>Primary</option>
<option value='secondary'>Secondary</option>
<option value='tertiary'>Tertiary</option>
    </select>
    <button type="button" id="clearFilterBtn" class="filter-btn" name='clear'>Clear Filter</button>
    `





    filter.innerHTML = filterHtml

    // Event Listeners
    document.getElementById('colorInputFilter').addEventListener('input', handleFilterInput)

    document.getElementById('familyInputFilter').addEventListener('change', handleFilterInput)

    document.getElementById('clearFilterBtn').addEventListener('click', handleClearFilterClick)

  }

  function handleFilterInput(e) {
    const { name, value } = e.target
    filterData = {
      ...filterData,
      [name]: value
    }
    console.log(filterData)
    const filterValues = filterData
    filterList(filterValues)
  }

  function filterList(filterValues) {
    const filteredList = colors.filter(color => (
      (!filterValues.color || color.color.toLowerCase().includes(filterValues.color.toLowerCase())) &&
      (filterValues.family === 'all' || color.dbFamily === filterValues.family)
    ))
    renderList(filteredList)
  }

  function handleClearFilterClick() {
    document.getElementById('colorInputFilter').value = ''
    message.textContent = 'Filter Cleared'
    renderList(colors)
  }

  function renderForm() {

    const formHtml =
      `
      <h4>Color Form </h4>
      <label for="colorInput">Color:</label>
      <input type="text" id="colorInput" class="form-input" name="color" placeholder="Color name..." />
         <label for="codeInput">HEX:</label>
      <input type="text" id="codeInput" class="form-input" name="code" placeholder="#000000..." />
       <label for="familyInput">Type:</label>
         <select id="familyInput" name="family" >
    <option value="all" selected disabled>Choose one...</option>
  <option value='deep-tone'>Deep Tone</option>
<option value='earth-tone'>Earth Tone</option>
<option value='neon'>Neon</option>
<option value='pastel'>Pastel</option>
<option value='primary'>Primary</option>
<option value='secondary'>Secondary</option>
<option value='tertiary'>Tertiary</option>
    </select>
      <button type="submit" name="submit" class="form-btn">✓ Submit</button>
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

  list.addEventListener('click', handleItemButtonClick)
  function handleItemButtonClick(e) {
    const { id, name } = e.target
    const colorObj = colors.find(color => color.id === id)
    selectedColor = colorObj
    if (name === "del") {
      deleteColor(id)
    } else {
      if (name === "view") {
        hex = "#" + colorObj.code
        renderCube(hex)
      }
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
      message.textContent = 'Colors Fetched'
      renderList(data)
      renderForm()
      renderCube(hex)
      renderFilter()
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
        throw new Error('bad fetch in POST')
      }
      await fetchColors()
      message.textContent = 'New Color Created'
    } catch (error) { console.error(error) }
  }

  async function deleteColor(id) {
    try {
      const r = await fetch(`http://localhost:3000/colors/${id}`, {
        method: 'DELETE',
      })
      if (!r.ok) {
        throw new Error('bad fetch in DELETE')
      }
      await fetchColors()
      message.textContent = 'Color Deleted'
    } catch (error) { console.error(error) }
  }


}

window.addEventListener("DOMContentLoaded", init)