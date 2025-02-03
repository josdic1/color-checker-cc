const init = () => {

  let loading = true
  let editMode = false
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
        <button type='button' id='testBtn' name='testBtn'>TEST</button>
        <button type='submit' id='testBtn' name='testBtn'>TEST</button>
        <button type='button' id='clearBtn' name='clearBtn'>CLEAR</button>      
        </div>
        `

    form.innerHTML = formHtml

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


}

window.addEventListener("DOMContentLoaded", init)