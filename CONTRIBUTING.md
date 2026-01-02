# Contributing to Bitred UI

Obrigado por contribuir com o Bitred UI.

Este projeto segue o modelo shadcn-like.
Leia atentamente antes de enviar alterações.

## Regras gerais

- Componentes devem funcionar quando copiados
- Nada pode depender de runtime externo
- Evite abstrações desnecessárias
- Não utilize hacks no CLI do shadcn-vue

## Adicionando um componente ou bloco

1. Crie o componente em:

apps/docs/registry/new-york/NomeDoComponente/NomeDoComponente.vue

Regras:
- Usar <script setup>
- Usar Tailwind CSS
- Evitar lógica complexa

2. Registrar no registry.json

Campos obrigatórios:
- name (kebab-case)
- type (registry:component ou registry:block)
- files apontando para o arquivo Vue

3. Testar localmente

npx shadcn-vue@latest build
npm run dev

Confirmar que existe:

/public/r/nome-do-item.json

## O que evitar

- Imports globais
- Plugins automáticos
- Aliases mágicos
- Dependências ocultas

## Validação

A validação é feita manualmente por:
- build do registry
- instalação via shadcn-vue add URL
- verificação visual

## Dúvidas

Abra uma issue descrevendo claramente o problema ou proposta.
