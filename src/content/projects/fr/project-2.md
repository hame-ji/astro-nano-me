---
title: "gogomate"
description: "Outil CLI de génération de lettres de motivation personnalisées à partir de l'URL d'une offre d'emploi."
date: "Apr 9 2025"
repoURL: "https://github.com/hame-ji/gogomate"
---

_Générer une lettre de motivation personnalisée depuis un terminal !_

## Faire mieux

J'avais une solution qui fonctionnait pour m'aider à rédiger des lettres de motivation avec [motivation-mate](/astro-nano-me/fr/projects/project-1). Mais le niveau de simplicité d'utilisation était encore insuffisant pour moi. Lancer l'application, ouvrir un navigateur, copier-coller l'URL et cliquer sur le bouton "Copier" pour la sauvegarder dans le presse-papiers m'a semblé trop long à l'usage.

Ce que je cherchais, c'était une solution en une seule commande depuis un terminal : parce que j'en ai toujours un d'ouvert et que la navigation entre les applications avec des raccourcis est très rapide.

## MVP

- **Réduire la friction** : récupérer l'url, le coller avec la bonne commande et c'est tout ! Pas plus de clics que nécessaire.
- **Centraliser les résultats** : stocker les lettres générées dans un dossier spécifique pour le suivi et l'organisation.
- **Accès immédiat au résultat** : une fois la lettre générée, elle est automatiquement copiée dans le presse-papiers pour une révision rapide.

## Golang

Beaucoup de mes pairs m'ont vanté l'expérience développeur de Go et j'avais envie de voir ce que cela donnait. Par ailleurs la possibilité de produire des exécutables facilement m'intéressait pour de futurs projets. Ce sont les raisons pour lesquelles **gogomate** est entièrement écrit en Go. Le [repo](https://github.com/hame-ji/gogomate) est en public sur GitHub.

## Démo

Même si tout est expliqué en détail dans le [README](https://github.com/hame-ji/gogomate/blob/main/README.md), ci-dessous un petit exemple en action. On peut utiliser le script depuis le projet mais tout l'intérêt est de build le binaire et de le déplacer dans le path du système pour une utilisation globale. De cette façon (après une configuration minimale) on appelle la commande `gogomate gen "https://example.com/job-posting" "optional-company-name"` et c'est parti !

![GIF](../gogomatedemo.gif)

Quelques secondes plus tard, tout est prêt !

![Screenshot](../gogomatedemo2.png)
