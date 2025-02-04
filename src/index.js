const init = () => {

  let isLoading = true
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

  const cube = document.getElementById('cube')
  const form = document.getElementById('form')
  const list = document.getElementById('list')

  fetchColors()

  function renderCube(colorCode) {
    const cubeHtml =
      `<h1 id="colorSphere" style="color: ${colorCode}; font-size: 200px;">⬤</h1>`

    cube.innerHTML = cubeHtml
  }

  function renderList(data) {
    const colorList = data.map(c => (
      `<tr>
        <td>${c.id}</td>
        <td>${c.color}</td>
        <td>${c.code}</td>
        <td><button type='button' id="view" name="${c.id}">View</button></td>
        <td><button type='button' id="edit" name="${c.id}">Edit</button></td>
        <td><button type='button' id="del" name="${c.id}">Del</button></td>
      </tr>`
    ))

    const listHtml =
      `<table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Color</th>
            <th>Code</th>
            <th>👁</th>
            <th>✎</th>
            <th>␡</th>
          </tr>
        </thead>
        <tbody>
          ${colorList.join('')}
        </tbody>
      </table>`

    list.innerHTML = listHtml

    document.getElementById('view').addEventListener("click", function (e) {
      const { name } = e.target
      console.log(name)
      selectedColor = colors.find(color => color.id === name)
      console.log(selectedColor)
      renderCube(selectedColor.code)
    })


  }

  function renderForm() {
    const formHtml =
      `<label formHtml="colorInput">Color </label>
    <input type='text' id='colorInput' name='colorInput' placeholder="Color name..." />
    <label formHtml="codeInput">Code </label>
        <input type='text' id='codeInput' name='codeInput' placeholder="Color code..." />
        <div id="btn-menu">
        <button type='button' id='test' name='test'>TEST</button>
        <button type='submit' id='submit' name='test'>SUBMIT</button>
        <button type='button' id='clear' name='clear'>CLEAR</button>      
        </div>
        `

    form.innerHTML = formHtml

    document.getElementById('test').addEventListener('click', function (e) {
      let cube;

      const { id } = e.target
      if (id === "test") {
        cube = document.getElementById('codeInput').value
        let cubeString = cube.slice(0, 7).includes("#") ? cube.replace("#", "").slice(0, 6) : cube.slice(0, 6)
        cube = "#" + cubeString.toLowerCase()
        renderCube(cube)
      }
    })

    document.getElementById('submit').addEventListener('submit', function (e) {
      e.preventDefault()
    })

    document.getElementById('clear').addEventListener('click', function (e) {
      const { id } = e.target
      if (id === 'clear') {
        clearForm()
      }
    })

  }

  async function fetchColors() {
    try {
      const r = await fetch(`http://localhost:3000/colors`)
      if (!r.ok) {
        throw new Error('GET: bad fetch')
      }
      const data = await r.json()
      colors = data
      const cube = ""
      renderList(data)
      renderForm()
      renderCube(cube)
    } catch (error) { console.error(error) }
  }


  function clearForm() {
    document.getElementById('colorInput').value = ''
    document.getElementById('codeInput').value = ''
    renderCube('efefef')
  }

  function cleanUp() {
    inEditMode = false
    isLoading = true
    formData = {
      color: '',
      code: ''
    }
    selectedColor = {
      id: '',
      color: '',
      code: ''
    }
  }


}

window.addEventListener("DOMContentLoaded", init)