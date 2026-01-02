# Bitred UI

Bitred UI é um registry de componentes e blocos UI no estilo shadcn,
focado em Vue 3 e shadcn-vue.

Os componentes são copiados para o projeto consumidor,
permitindo customização total do código.

## Características

- Vue 3
- shadcn-vue
- Tailwind CSS v4
- Registry estático em JSON
- Sem runtime adicional

## Pré-requisitos

- Node.js 18+
- Projeto Vue 3 ou Nuxt
- shadcn-vue inicializado

Inicialização do shadcn-vue:

npx shadcn-vue@latest init

## Instalação de um componente

npx shadcn-vue@latest add https://ui.bitred.com.br/r/hello-world.json

O comando copia o código diretamente para o projeto.

## Estrutura do projeto

apps/docs
- registry/
- registry.json
- public/r/
- Nuxt v4

## Desenvolvimento local

cd apps/docs
npm install
npm run dev

Gerar os arquivos do registry:

npx shadcn-vue@latest build

## Contribuição

Leia o arquivo CONTRIBUTING.md antes de contribuir.

## Licença

MIT
