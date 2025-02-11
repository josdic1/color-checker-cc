const init = () => {

  let inEditMode = false
  let colors = []
  let formData = {
    color: '',
    code: '',
    family: ''
  }
  let filterData = {
    color: '',
    family: 'all'
  }
  let selectedColor = {
    id: '',
    color: '',
    code: '',
    family: ''
  }
  let hex = "#3bb9b3"


  const message = document.getElementById('message')
  const form = document.getElementById('form')
  const cube = document.getElementById('cube')
  const filter = document.getElementById('filter')
  const sort = document.getElementById('sort')
  const list = document.getElementById('list')


  fetchColors()


  function renderCube(code) {

    const cubeHtml =
      `<h1 id='sphere' class="fill-text" style="color: ${code}"> ■ ▣ ▧ </h1>`

    cube.innerHTML = cubeHtml
  }

  function renderFilter() {
    const filterHtml =
      ` <h4 class='filter-title'>Color Filter </h4>
      <label class='filter-label' for="colorInputFilter">Color:</label>
      <input type="text" id="colorInputFilter" class="filter-input" name="color" placeholder="Type something..." />
      <label class='filter-label' for="familyInputFilter">Type:</label>
    <select id="familyInputFilter" name="family" class='filter-input'>
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
      <h4 class='form-title'>Color Form </h4>
      <label class='form-label' for="colorInput">Color:</label>
      <input type="text" id="colorInput" class="form-input" name="color" placeholder="Color name..." />
         <label class='form-label' for="codeInput">HEX:</label>
      <input type="text" id="codeInput" class="form-input" name="code" placeholder="#000000..." />
       <label class='form-label' for="familyInput">Family:</label>
         <select id="familyInput" name="family" >
    <option value="all" selected disabled>Select...</option>
  <option value='deep-tone'>Deep Tone</option>
<option value='earth-tone'>Earth Tone</option>
<option value='neon'>Neon</option>
<option value='pastel'>Pastel</option>
<option value='primary'>Primary</option>
<option value='secondary'>Secondary</option>
<option value='tertiary'>Tertiary</option>
    </select>
    <div class='form-btn-menu'>
      <button type="submit" name="submit" class="form-btn">✓ Submit</button> <button type="button" id="cancel" name="cancel" class="form-btn">Cancel</button>
      </div>
      `
    form.innerHTML = formHtml

    // Event Listeners
    document.getElementById('colorInput').addEventListener('input', handleFormInput)

    document.getElementById('codeInput').addEventListener('input', handleFormInput)

    document.getElementById('familyInput').addEventListener('input', handleFormInput)


    document.getElementById('cancel').addEventListener('click', handleCancelClick)

    form.addEventListener('submit', handleSubmitClick)



  }

  function handleFormInput(e) {
    const { name, value } = e.target
    formData = {
      ...formData,
      [name]: value
    }
  }

  function handleCancelClick(e) {
    const { id } = e.target
    if (id === 'cancel') {
      document.getElementById('colorInput').value = ""
      document.getElementById('codeInput').value = ""
      document.getElementById('familyInput').value = ""
    }
  }

  function handleSubmitClick(e) {
    e.preventDefault()
    const { name, value } = e.target
    if (inEditMode) {
      selectedColor = {
        ...selectedColor,
        color: document.getElementById('colorInput').value,
        code: document.getElementById('codeInput').value,
        family: document.getElementById('familyInput').value
      }
      const updatedColor = selectedColor
      updateColor(updatedColor)
    } else {
      const newColor = formData
      createColor(newColor)
    }
  }

  function renderSort() {
    const sortHtml =
      `
      <div id='btn-menu' class="sort-container">
      Sort colors:
        <button type='button' class='sort-btn' id='ascAlpha' name='color'>Color (A-Z)</button>
        <button type='button' class='sort-btn' id="descAlpha" name='color'>Color (Z-A)</button>
           <button type='button' class='sort-btn' id='ascFamily' name='family'>Family (A-Z)</button>
        <button type='button' class='sort-btn' id="descFamily" name='family'>Family (Z-A)</button>
                <button type='button' class='sort-btn' id="clearSort" name='clear'>Reset</button>
      </div>`

    sort.innerHTML = sortHtml

    document.getElementById('ascAlpha').addEventListener('click', sortColors)
    document.getElementById('descAlpha').addEventListener('click', sortColors)
    document.getElementById('ascFamily').addEventListener('click', sortColors)
    document.getElementById('descFamily').addEventListener('click', sortColors)
    document.getElementById('clearSort').addEventListener('click', resetSort)
  }

  let sortedList = []
  function sortColors(e) {
    const { id, name } = e.target
    if (name === 'color') {
      if (id === 'ascAlpha') {
        sortedList = [...colors].sort((a, b) => a.color.localeCompare(b.color))
      } else {
        if (id === 'descAlpha') {
          sortedList = [...colors].sort((a, b) => b.color.localeCompare(a.color))
        }
      }
      renderList(sortedList)
    } else {
      if (name === 'family') {
        if (id === 'ascFamily') {
          sortedList = [...colors].sort((a, b) => a.family.localeCompare(b.family))
        } else {
          if (id === 'descFamily') {
            sortedList = [...colors].sort((a, b) => b.family.localeCompare(a.family))
          }
        }
        renderList(sortedList)
      }
    }
  }


  function resetSort() {
    renderList(colors)
  }

  function renderList(data) {

    const colorList = data.map(item => (
      `<tr>
        <td>${item.id}</td>
        <td>${item.color}</td>
        <td>${item.code}</td>
        <td>${item.family}</td>
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
            <th>family</th>
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
      } else {
        if (name === 'edit') {
          inEditMode = true
          selectedColor = colorObj
          message.textContent = 'Edit Mode, selectedColor Set'

          //populate form with existing color
          document.getElementById('colorInput').value = colorObj.color
          document.getElementById('codeInput').value = colorObj.code
          document.getElementById('familyInput').value = colorObj.dbFamily
        }
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
      renderSort()
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

  async function updateColor(updatedColor) {
    try {
      const r = await fetch(`http://localhost:3000/colors/${updatedColor.id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedColor)
      })
      if (!r.ok) {
        throw new Error('bad fetch in PATCH')
      }
      await fetchColors()
      message.textContent = 'Color Updated'
    } catch (error) { console.error(error) }
  }


}

window.addEventListener("DOMContentLoaded", init)