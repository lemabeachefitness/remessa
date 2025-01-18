// Elementos do DOM
const productGrid = document.getElementById('productGrid');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const productForm = document.getElementById('productForm');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const mainContent = document.getElementById('mainContent');
const summarySection = document.getElementById('summarySection');
const productSection = document.getElementById('productSection');
const summaryCards = document.getElementById('summaryCards');
const summaryTable = document.getElementById('summaryTable');
const exportPDFBtn = document.getElementById('exportPDF');
const pageTitle = document.getElementById('pageTitle');

// Lista de produtos atualizada
const products = [
    { name: 'Biquíni', icon: 'fas fa-female' },
    { name: 'Maiô', icon: 'fas fa-swimmer' },
    { name: 'Sunga', icon: 'fas fa-male' },
    { name: 'Saída de Praia', icon: 'fas fa-umbrella-beach' },
    { name: 'Chapéu Infantil', icon: 'fas fa-hat-cowboy' },
    { name: 'Camisa', icon: 'fas fa-tshirt' },
    { name: 'T-Shirt', icon: 'fas fa-tshirt' },
    { name: 'Regata', icon: 'fas fa-vest-patches' },
    { name: 'Calça League', icon: 'fas fa-socks' },
    { name: 'Short League', icon: 'fas fa-shorts' },
    { name: 'Top', icon: 'fas fa-female' }
];

// Array para armazenar os lançamentos
let launches = [];

// Função para criar botões de produto
function createProductButtons() {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const button = document.createElement('button');
        button.className = 'product-button';
        button.innerHTML = `<i class="${product.icon}"></i><span>${product.name}</span>`;
        button.onclick = () => openModal(product.name);
        productGrid.appendChild(button);
    });
}

// Função para abrir o modal
function openModal(productName) {
    document.getElementById('modalTitle').textContent = `Lançar ${productName}`;
    modal.style.display = 'block';
    
    // Resetar o formulário
    productForm.reset();
    
    // Preencher as opções de tamanho
    const sizeSelect = document.querySelector('select[name="size"]');
    sizeSelect.innerHTML = '';
    const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', '1', '2', '3', '4', '6', '8', '10', '12', '14', '16'];
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });
}

// Função para fechar o modal
function closeModalFunction() {
    modal.style.display = 'none';
    productForm.reset();
}

// Função para lançar produto
function launchProduct(event) {
    event.preventDefault();
    const formData = new FormData(productForm);
    const launch = {
        product: document.getElementById('modalTitle').textContent.replace('Lançar ', ''),
        gender: formData.get('gender'),
        ageGroup: formData.get('ageGroup'),
        size: formData.get('size'),
        quantity: parseInt(formData.get('quantity')),
        unitPrice: parseFloat(formData.get('unitPrice').replace('R$', '').trim()),
        totalValue: 0
    };
    launch.totalValue = launch.quantity * launch.unitPrice;

    if (confirm("Confirma o lançamento deste produto?")) {
        launches.push(launch);
        closeModalFunction();
        updateSummary();
    }
}


// Função para atualizar o resumo
function updateSummary() {
    summaryCards.innerHTML = '';
    let totalQuantity = 0;
    let totalValue = 0;

    launches.forEach((launch, index) => {
        totalQuantity += launch.quantity;
        totalValue += launch.totalValue;

        const card = document.createElement('div');
        card.className = 'summary-card';
        card.innerHTML = `
            <h3>${launch.product}</h3>
            <p>Gênero: ${launch.gender}</p>
            <p>Faixa Etária: ${launch.ageGroup}</p>
            <p>Tamanho: ${launch.size}</p>
            <p>Quantidade: ${launch.quantity}</p>
            <p>Valor Unitário: R$ ${launch.unitPrice.toFixed(2)}</p>
            <p>Valor Total: R$ ${launch.totalValue.toFixed(2)}</p>
            <div class="card-buttons">
                <button class="card-button edit-btn" onclick="editLaunch(${index})">Editar</button>
                <button class="card-button delete-btn" onclick="deleteLaunch(${index})">Excluir</button>
            </div>
        `;
        summaryCards.appendChild(card);
    });

    updateSummaryTable(totalQuantity, totalValue);
}

// Função para atualizar a tabela de resumo
function updateSummaryTable(totalQuantity, totalValue) {
    const tableBody = summaryTable.querySelector('tbody');
    tableBody.innerHTML = '';
    launches.forEach(launch => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${launch.product}</td>
            <td>${launch.gender}</td>
            <td>${launch.ageGroup}</td>
            <td>${launch.size}</td>
            <td>${launch.quantity}</td>
            <td>R$ ${launch.unitPrice.toFixed(2)}</td>
            <td>R$ ${launch.totalValue.toFixed(2)}</td>
        `;
    });

    // Adicionar linha de resumo
    const summaryRow = tableBody.insertRow();
    summaryRow.innerHTML = `
        <td colspan="4"><strong>Total Geral</strong></td>
        <td><strong>${totalQuantity}</strong></td>
        <td><strong>-</strong></td>
        <td><strong>R$ ${totalValue.toFixed(2)}</strong></td>
    `;
}

// Função para editar um lançamento
function editLaunch(index) {
    if (confirm("Deseja realmente editar este lançamento?")) {
        const launch = launches[index];
        openModal(launch.product);
        document.querySelector(`input[name="gender"][value="${launch.gender}"]`).checked = true;
        document.querySelector('select[name="ageGroup"]').value = launch.ageGroup;
        document.querySelector('select[name="size"]').value = launch.size;
        document.querySelector('input[name="quantity"]').value = launch.quantity;
        document.querySelector('input[name="unitPrice"]').value = launch.unitPrice.toFixed(2);
        launches.splice(index, 1);
    }
}


// Função para deletar um lançamento
function deleteLaunch(index) {
    if (confirm("Tem certeza que deseja excluir este lançamento?")) {
        launches.splice(index, 1);
        updateSummary();
    }
}


// Função para alternar a sidebar
function toggleSidebar() {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
}

// Função para mostrar a seção de produtos
function showProducts() {
    productSection.style.display = 'block';
    summarySection.style.display = 'none';
    pageTitle.textContent = 'Controle de Envio de Produtos';
    closeSidebarOnMobile();
}

// Função para mostrar o resumo
function showSummary() {
    productSection.style.display = 'none';
    summarySection.style.display = 'block';
    pageTitle.textContent = 'Resumo de Lançamentos';
    updateSummary();
    closeSidebarOnMobile();
}

// Função para fechar a sidebar em dispositivos móveis
function closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    }
}

// Função para exportar para PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;

    // Solicitar informações do usuário
    const loja = prompt("Digite o nome da loja:");
    const cliente = prompt("Digite o nome do cliente:");

    const doc = new jsPDF();
    let yPos = 20;

    // Adicionar informações do cabeçalho
    doc.setFontSize(16);
    doc.text(`Loja: ${loja}`, 14, yPos);
    yPos += 10;
    doc.text(`Cliente: ${cliente}`, 14, yPos);
    yPos += 15;

    doc.setFontSize(14);
    doc.text('Resumo de Lançamentos', 14, yPos);
    yPos += 10;

    doc.setFontSize(12);
    let totalQuantity = 0;
    let totalValue = 0;

    // Agrupar lançamentos por produto
    const groupedLaunches = launches.reduce((acc, launch) => {
        if (!acc[launch.product]) {
            acc[launch.product] = [];
        }
        acc[launch.product].push(launch);
        return acc;
    }, {});

    // Listar itens agrupados
    for (const [product, items] of Object.entries(groupedLaunches)) {
        doc.text(`${product}:`, 14, yPos);
        yPos += 7;

        const groupedByAgeGroup = items.reduce((acc, item) => {
            if (!acc[item.ageGroup]) {
                acc[item.ageGroup] = 0;
            }
            acc[item.ageGroup] += item.quantity;
            return acc;
        }, {});

        for (const [ageGroup, quantity] of Object.entries(groupedByAgeGroup)) {
            doc.text(`  - ${quantity} ${ageGroup}`, 20, yPos);
            yPos += 7;
        }

        items.forEach(item => {
            totalQuantity += item.quantity;
            totalValue += item.totalValue;
        });

        yPos += 3;

        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
    }

    // Adicionar resumo geral
    yPos += 10;
    doc.setFontSize(14);
    doc.text('Resumo Geral', 14, yPos);
    yPos += 7;
    doc.setFontSize(12);
    doc.text(`Quantidade Total: ${totalQuantity}`, 14, yPos);
    yPos += 7;
    doc.text(`Valor Total: R$ ${totalValue.toFixed(2)}`, 14, yPos);

    doc.save('resumo_lancamentos.pdf');
}


// Event Listeners
closeModal.addEventListener('click', closeModalFunction);
productForm.addEventListener('submit', launchProduct);
toggleSidebarBtn.addEventListener('click', toggleSidebar);
exportPDFBtn.addEventListener('click', exportToPDF);
sidebarOverlay.addEventListener('click', closeSidebarOnMobile);

// Adicionando event listeners para os botões do menu lateral
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const action = e.target.getAttribute('data-action');
        if (action === 'showProducts') showProducts();
        if (action === 'showSummary') showSummary();
    });
});

// Inicialização
createProductButtons();
showProducts();

// Verificar se todos os elementos necessários estão presentes
document.addEventListener('DOMContentLoaded', function() {
    if (!productGrid || !modal || !closeModal || !productForm || !toggleSidebarBtn || !sidebar || !mainContent || !summarySection || !productSection || !summaryCards || !summaryTable || !exportPDFBtn || !sidebarOverlay || !pageTitle) {
        console.error('Um ou mais elementos necessários não foram encontrados no DOM');
    }
});
