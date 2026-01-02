# AGENTS.md

Este documento descreve como o projeto Bitred UI funciona internamente.

O Bitred UI segue o modelo shadcn-like, onde componentes e blocos são distribuídos como código copiável, não como dependências de runtime.

## Objetivo do projeto

- Fornecer componentes e blocos UI para Vue 3
- Seguir o modelo oficial do shadcn-vue
- Evitar qualquer comportamento mágico
- Garantir que o projeto consumidor seja dono do código

## Arquitetura

apps/docs
- Nuxt v4 (documentação)
- registry/        Código-fonte dos componentes
- registry.json    Índice do registry
- public/r/        Arquivos JSON gerados pelo build

## Fluxo de funcionamento

1. Componentes Vue ficam em apps/docs/registry
2. registry.json descreve os itens disponíveis
3. shadcn-vue build gera arquivos em public/r
4. O Nuxt serve esses arquivos estaticamente
5. Projetos externos instalam via URL usando o CLI do shadcn-vue

Exemplo de instalação:

npx shadcn-vue@latest add https://ui.bitred.com.br/r/hello-world.json

## Registry item

Um registry item pode ser:

- registry:component — componente isolado
- registry:block — bloco composto

Cada item define:
- arquivos a serem copiados
- dependências do shadcn-vue (registryDependencies)

## O que este projeto não faz

- Não publica pacotes npm
- Não fornece imports globais
- Não cria CLI próprio
- Não utiliza aliases mágicos

Essas decisões são intencionais.

## Princípios

- Simplicidade
- Transparência
- Alinhamento com shadcn-vue oficial

Se algo não for suportado oficialmente pelo shadcn-vue, não será implementado.
