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
      const colorId = String(id.split('-')[1].trim())
      selectedColor = colors.find(c => c.id === colorId);
      if (name === 'edit') {
        inEditMode = true
        const updatedColor = selectedColor
        document.getElementById('colorInput').value = updatedColor.color
        document.getElementById('codeInput').value = updatedColor.code
      }
      if (name === 'del') {
        const deletedColor = selectedColor
        deleteColor(deletedColor)
      }
    });

  }

  function renderForm() {
    const formHtml =
      `<label formHtml="colorInput">Color </label>
    <input type='text' id='colorInput' name='color' class="form-input" placeholder="Color name..." />
    <label formHtml="codeInput">Code </label>
        <input type='text' id='codeInput' name='code' class="form-input" placeholder="Color code..." />
        <div id="btn-menu">
        <button type='button' id='test' name='test'>TEST</button>
        <button type='submit' id='submit' name='submit'>SUBMIT</button>
        <button type='button' id='clear' name='clear'>CLEAR</button>      
        </div>
        `

    form.innerHTML = formHtml
    let colorValue;
    let codeValue;

    form.addEventListener('submit', function (e) {
      e.preventDefault()
      if (inEditMode) {
        colorValue = document.getElementById('colorInput').value
        codeValue = document.getElementById('codeInput').value
        const colorToUpdate = {
          id: selectedColor.id,
          color: colorValue,
          code: codeValue
        }
        selectedColor = colorToUpdate
        updateColor(colorToUpdate)
      } else {
        colorValue = document.getElementById('colorInput').value
        codeValue = document.getElementById('codeInput').value
        const colorToCreate = {
          color: colorValue,
          code: codeValue
        }
        formData = colorToCreate
        createColor(colorToCreate)
      }
    })

    // const colorInputValue = document.getElementById('colorInput').addEventListener('input', function (e) {
    //   populateForm(e.target.name, e.target.value)
    // })

    // const codeInputValue = document.getElementById('codeInput').addEventListener('input', function (e) {
    //   populateForm(e.target.name, e.target.value)
    // })


    document.getElementById('test').addEventListener('click', handleTestClick)
    document.getElementById('clear').addEventListener('click', handleClearClick)

  }

  /* Handler Fucntions*/
  function handleTestClick() {
    let cube;

    cube = document.getElementById('codeInput').value
    //can be reused
    let cubeString = cube.slice(0, 7).includes("#") ? cube.replace("#", "").slice(0, 6) : cube.slice(0, 6)
    cube = "#" + cubeString.toLowerCase()
    renderCube(cube)
  }


  function handleClearClick() {
    clearForm()
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



  async function createColor(newColor) {
    try {
      const r = await fetch(`http://localhost:3000/colors/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newColor)
      });

      if (!r.ok) {
        throw new Error('POST: bad fetch');
      }

      const createdColor = await r.json();
      console.log("Created color:", createdColor);

      return createdColor; // Return the created color instead of calling fetchColors()
    } catch (error) {
      console.error("Error creating color:", error);
      return null;
    }
  }


  async function deleteColor(color) {
    if (!color || !color.id) {
      console.error("Invalid color object:", color);
      return;
    }
    try {
      const r = await fetch(`http://localhost:3000/colors/${color.id}/`, {
        method: 'DELETE'
      })
      if (!r.ok) {
        throw new Error('Bad response: DELETE')
      }
      await fetchColors()
    } catch (error) { console.error(error) }
  }

  async function updateColor(updatedColor) {
    try {
      console.log('updated color...', updatedColor.color)
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