# Contribuindo

Obrigado por dedicar seu tempo para contribuir com este projeto! 

## Relatando Bugs

Se você encontrar um erro, por favor abra uma **Issue** detalhando:
- O comportamento atual.
- O comportamento esperado.
- Passos para reproduzir o problema.

## Fluxo de Trabalho (Workflow)

> ⚠️ **Importante:** a branch mais atualizada do projeto é sempre a **`dev`**.  
> Todas as contribuições devem partir dela e os Pull Requests devem ser abertos contra a `dev`.

1. Faça um **Fork** do repositório.
2. Crie uma branch para sua modificação:
   ```bash
   git checkout -b feature/nome-da-feature
   ```
3. Realize suas alterações e faça o commit (veja a seção de commits abaixo).
4. Envie sua branch para o seu fork:
   ```bash
   git push origin feature/nome-da-feature
   ```
5. Abra um **Pull Request (PR)** para a branch `dev` do repositório original.

## Commits Semânticos

Utilizamos o padrão de **Git Semântico (Conventional Commits)**. Seus commits devem seguir este formato:

`tipo: descrição curta`

**Tipos comuns:**
- `feat`: Uma nova funcionalidade.
- `fix`: Correção de um bug.
- `docs`: Alterações na documentação.
- `style`: Alterações que não afetam o significado do código (espaços, formatação, etc).
- `refactor`: Alteração de código que não corrige bug nem adiciona funcionalidade.
- `test`: Adição ou correção de testes.
- `chore`: Atualizações de tarefas de build, pacotes, etc.

*Exemplo:* `feat: adiciona sistema de login`

## Requisitos para Pull Requests

- O código deve ser legível e seguir os padrões do projeto.
- Desccreva brevemente o que foi feito no PR.
- Certifique-se de que sua branch está atualizada com a `dev` original antes de enviar.
