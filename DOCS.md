# WhatsApp Web Prefixer - Documentação Técnica

Esta documentação detalha a arquitetura, o funcionamento e os processos de build da extensão **WhatsApp Web Prefixer**.

## Visão Geral

O WhatsApp Web Prefixer é uma extensão de navegador baseada no **Manifest V3** que automatiza a inserção de prefixos personalizáveis no campo de digitação do WhatsApp Web. A solução foi projetada com foco em modularidade, autonomia institucional e facilidade de manutenção.

## Arquitetura do Sistema

A extensão segue um modelo de separação de responsabilidades para garantir que o código seja reutilizável em diferentes contextos (Popup, Background e Content Script).

### 1. Separação de Scripts (Backend)

O backend foi estruturado de forma modular para organizar a lógica de negócio:

*   **Classes (`src/backend/classes/`)**: Contêm lógicas isoladas em arquivos específicos para serem importadas conforme a necessidade.
    *   **BrowserStorage.js**: Abstração para as APIs de armazenamento (`chrome.storage` ou `browser.storage`). Funciona como um invólucro (wrapper) que permite salvar e recuperar dados de forma transparente, com fallback para `localStorage`.
    *   **Whatsapp.js**: Gerencia a manipulação da interface do WhatsApp Web. Utiliza `MutationObserver` para monitorar mudanças no DOM e garantir que o prefixo seja aplicado mesmo após a troca de conversas.
*   **Utilitários (`src/backend/utils.js`)**: Centraliza funções auxiliares gerais e úteis.
    *   Inclui funções sem estado (stateless), como a sanitização de HTML, que podem ser chamadas por qualquer parte do sistema sem depender de instâncias de classes.
*   **Inicialização (`src/backend/init.js`)**: Responsável por iniciar o instanciamento das classes e declarar variáveis globais.
    *   Define o estado global do prefixo e configura os ouvintes (listeners) que atualizam a interface em tempo real quando o usuário altera as configurações no popup.

### 2. Interface de Configuração (Frontend)

Localizada em `src/frontend/`, provê a interface visual para o usuário.
*   **Popup (HTML/CSS)**: Um formulário simples para definição do prefixo.
*   **Popup.js**: Conecta a interface ao `BrowserStorage` para persistir as preferências do usuário.

## Componentes de Execução

### Background Script
O arquivo `src/backend/background.js` gerencia o ciclo de vida da extensão. Ao ser instalada, ele identifica todas as abas abertas do WhatsApp Web e as recarrega, garantindo que o script de conteúdo seja injetado imediatamente sem a necessidade de intervenção manual do usuário.

### Injeção de Conteúdo (Content Script)
O script final injetado na página é uma combinação das classes, utilitários e o script de inicialização. Ele detecta o elemento `contenteditable`, verifica a ausência do prefixo e utiliza o comando `insertText` para injetar o texto de forma que a aplicação web original reconheça a interação.

## Processo de Build

Como a extensão é desenvolvida de forma modular (vários arquivos), o processo de build é necessário para concatenar os scripts nos arquivos finais exigidos pelos navegadores (`content.js`, `background.js` e `popup.js`).

### Script de Build (`scripts/build.sh`)
O script realiza as seguintes etapas:
1.  **Limpeza**: Remove builds anteriores no diretório `build/`.
2.  **Manifesto**: Copia o manifesto específico para o alvo (Chrome ou Firefox).
3.  **Concatenação**: Une os arquivos na ordem correta:
    *   `content.js`: Classes de backend + Scripts de backend (exceto background) + Utils + Init.
    *   `background.js`: BrowserStorage + Lógica de background.
    *   `popup.js`: BrowserStorage + Lógica do frontend.
4.  **Empacotamento**: No caso do Firefox, gera um arquivo `.xpi` pronto para distribuição.

### Comandos de Build
No terminal, execute:
```bash
# Para Google Chrome e derivados
bash scripts/build.sh chrome

# Para Mozilla Firefox
bash scripts/build.sh firefox
```

## Instalação (Modo Desenvolvedor)

### Chrome / Edge / Brave
1. Vá para `chrome://extensions/`.
2. Ative o **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação**.
4. Selecione a pasta `build/chrome/unpacked`.

### Firefox
1. Vá para `about:debugging#/runtime/this-firefox`.
2. Clique em **Instalar extensão temporária**.
3. Selecione o arquivo `manifest.json` em `build/firefox/unpacked`.

## Requisitos Técnicos
*   **Manifest V3**.
*   **Navegadores**: Chrome (v88+) ou Firefox (v109+).
*   **Permissões**: `storage`, `tabs`, `scripting`.

## Licença e Créditos

Este projeto é mantido pelo **Centro de Agricultura Alternativa do Norte de Minas (CAA-NM)** e está sob a **Licença MIT**.
