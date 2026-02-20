---
title: "🧩 Context-driven engineering - contexte modèle et contexte humain"
description: "Une réflexion sur ce que pourrait être une organisation millimétrée et contrôlable des contextes fournis aux différents agents auxquels on assigne des tâches d'écriture de code."
date: "Feb 20 2026"
---

# Context-driven engineering : Optimiser le contexte pour les LLM

Comme tout le monde, je me suis essayé au _context-driven_ (ou encore _spec-driven_) _engineering_. Sans pouvoir déterminer au pourcent près à quel point c'est plus efficace que le _yolo-prompting_, je ressens quand même une réduction drastique des boucles d'itérations avec les agents et une arrivée au résultat désiré beaucoup plus directe.

À force de naviguer dans les eaux troubles de l'IA-marketing, de parcourir moult Discord et contenus générés par des LLM sur « _comment rendre la récupération et l'utilisation du contexte plus efficace_ », j'en suis venu à me poser la question suivante :

> Compte tenu du modèle économique des _providers_ de modèles SOTA (State of the Art), comment conjuguer **obtention de résultats quasi-déterministes** et **coûts maîtrisés** (autant que faire se peut) ?

## Circonscrire le contexte

On sait tous que _"less is more"_. Les fichiers `AGENTS.md` ou `CLAUDE.md` sont rois dans la fixation d'un contexte projet, surtout quand on les utilise avec des patterns de _doc-retrieval_. On précise nos règles particulières et on contraint le modèle à rester dans les clous.

Ok. Mais est-ce que l'agent à qui je fais exécuter une **tâche définie et circonscrite** a besoin de _tout_ le contexte à chaque fois ?

## Context-splitting : éviter la pollution de contexte

Ma conception de la chose est la suivante : idéalement, un agent assigné à une tâche de refacto ne devrait avoir **que** le contexte nécessaire à cette refacto. Il n'a pas besoin de connaître les règles de mise à jour de la documentation ou l'architecture de déploiement.

On peut même aller plus loin : ce contexte de refactoring devrait être divisé en périmètres distincts. Refactoriser un test, une vue front-end ou une requête SQL nécessite des règles précises et exclusives.

Autrement dit, **un contexte monolithique chargé systématiquement à chaque nouvelle session est contre-productif**, que ce soit en termes de qualité d'information (le modèle perd le focus) ou d'économie de tokens.

## Économiser les tokens : créer un "contexte modèle"

Admettons que l'on ait paramétré la récupération des contextes de manière si fine qu'un agent de review ne possède que le contexte rapporté à sa tâche. Pourquoi le lui fournir sous la forme d'un Markdown aéré, destiné au confort de lecture d'un humain, alors qu'il est destiné exclusivement à la machine ?

Il y a bien sûr la question de la maintenance de ces fichiers et de leur versionnement qui reste cruciale.

L'enjeu est de trouver une syntaxe allégée pour les écrire. L'objectif : conserver la qualité sémantique tout en réduisant la charge sur la fenêtre de contexte. On pourrait par exemple imaginer remplacer de longs paragraphes par des structures de données denses (JSON ou YAML minifié), ou encore tirer parti du **Prompt Caching** proposé par les API modernes, qui permet de pré-charger un contexte figé à moindre coût.

Pour bien visualiser la différence de "poids" et d'intention, prenons l'exemple d'une règle de création de composants UI.

**1. Le Markdown pour humain (Verbeux, poli, aéré)**

```markdown
# Guide de création des composants React

Bienvenue dans la documentation front-end.
Lors de la création ou de la refactorisation d'un composant, il est strictement demandé d'utiliser Tailwind CSS pour la gestion des styles.
De plus, pour garder des composants lisibles, veuillez extraire la logique métier dans des hooks personnalisés (custom hooks) si celle-ci dépasse 20 lignes.
```

**2. Le Markdown pour LLM (Direct, impératif, listes à puces)**

```markdown
# Rules: React UI

- Style: Tailwind CSS ONLY. No inline styles.
- Logic: Extract to custom hooks if > 20 lines.
- Output: Return ONLY code, no explanations.
```

**3. L'alternative YAML**

```yaml
rules:
  react_ui:
    style: "Tailwind CSS strictly"
    logic: "Extract to custom hooks (>20 lines)"
    output: "Code only"
```

## Ignorer le contexte "humain"

De la même manière que mon modèle préféré n'a pas besoin de connaître les secrets de mon `.env`, ne pourrait-on pas séparer strictement la documentation humaine (comme un `README.md` classique) du contexte ingéré par l'agent ?

C'est là qu'interviennent les fichiers d'ignorance. Pour ma part, j'utilise Kilo Code comme CLI, qui gère les fichiers `.kiloignore`. On peut y placer, en plus des exclusions classiques (`node_modules`, builds...), toutes les documentations purement humaines :

```text
# .kiloignore
node_modules/
dist/
.env

# Ignorer le contexte humain pour préserver l'attention du LLM
README.md
CONTRIBUTING.md
docs/user_guide/
```

De cette manière, on ne pollue pas l'espace sémantique du modèle. Il n'ira chercher ses instructions que parmi les fichiers créés **sur-mesure** pour lui.

## Limites et conclusion

Évidemment, cette approche chirurgicale a un coût cognitif pour le développeur. La première limite est la maintenabilité : séparer le contexte humain du contexte modèle implique de maintenir deux sources de vérité en parallèle. Le risque de désynchronisation entre la documentation officielle et les directives de l'agent est réel. La seconde limite est le bruit organisationnel (ou over-engineering) : à trop vouloir micro-manager les agents en découpant les contextes à l'extrême, on risque de passer plus de temps à configurer le framework de l'IA qu'à coder réellement l'application.

En fin de compte, le context engineering est un exercice d'équilibriste. Il s'agit de trouver le curseur optimal entre la réduction du bruit sémantique pour l'IA et la simplicité de gestion pour l'humain. C'est une discipline jeune, et nos outils (comme les éditeurs de code et les CLI) devront évoluer pour abstraire cette complexité et rendre la gestion de ce double contexte transparente.
