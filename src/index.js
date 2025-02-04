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
        <td><button type='button' id="view-${c.id}" name="view">View</button></td>
        <td><button type='button' id="edit-${c.id}" name="edit">Edit</button></td>
        <td><button type='button' id="del-${c.id}" name="del">Del</button></td>
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

    list.addEventListener("click", function (e) {
      const { id, name } = e.target;
      const colorId = id.split('-')[1].trim()
      selectedColor = colors.find(c => c.id === colorId);
      if (name === "view") {
        const cubeColor = selectedColor.code ? "#" + selectedColor.code : ''
        renderCube(cubeColor)
      } else {
        if (name === "del") {
          deleteColor(colorId)
        }
      }

    });

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

        //can be reused
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

  async function deleteColor(colorId) {
    try {
      const r = await fetch(`http://localhost:3000/colors/${colorId}/`, {
        method: 'DELETE'
      })
      if (!r.ok) {
        throw new Error('DELETE: bad fetch')
      }
      await fetchColors()
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