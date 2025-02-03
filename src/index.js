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

  function renderList(data) {
    const colorList = data.map(c => (
      `<tr>
        <td>${c.id}</td>
        <td>${c.color}</td>
        <td>${c.code}</td>
        <td><button type='button' id="view-${c.id}" name='view'>View</button></td>
        <td><button type='button' id="edit-${c.id}" name='edit'>Edit</button></td>
        <td><button type='button' id="del-${c.id}" name='del'>Del</button></td>
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
      const { id } = e.target
    })

    document.getElementById('submit').addEventListener('submit', function (e) {
      e.preventDefault()
    })

    document.getElementById('clear').addEventListener('click', function (e) {
      const { id, name } = e.target
      if (name === 'clear') {
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
      renderList(data)
      renderForm()
    } catch (error) { console.error(error) }
  }


  function clearForm() {
    document.getElementById('colorInput').value = ''
    document.getElementById('codeInput').value = ''
  }

  function cleanUp() {
    inEditMode = false
    isLoading = true
  }


}

window.addEventListener("DOMContentLoaded", init)