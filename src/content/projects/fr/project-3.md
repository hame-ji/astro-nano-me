---
title: "tldr-bot"
description: "Bot Telegram personnel qui transforme des URLs sauvegardées en digest quotidien."
date: "Mar 15 2026"
repoURL: "https://github.com/hame-ji/tldr-bot"
---

_Transformer des liens sauvegardés en digest quotidien que je lis vraiment._

J'ai construit [tldr-bot](https://github.com/hame-ji/tldr-bot) à partir d'une frustration simple : je sauvegarde beaucoup de liens techniques, et la plupart ne deviennent jamais de vraies lectures. Les onglets s'accumulent, les favoris deviennent bruyants, et du contenu utile se perd.

Je voulais un workflow léger dans la journée et utile le soir. L'interaction est donc volontairement minimale : j'envoie une URL sur Telegram, puis je reçois un digest quotidien avec des résumés concis.

Cette contrainte a guidé le reste du projet.

## Choisir le bon niveau de complexité

J'ai gardé une exécution serverless avec GitHub Actions, planifiée une fois par jour (avec déclenchement manuel si besoin). Le pipeline récupère les updates Telegram, filtre les messages de mon chat, extrait les URLs, récupère le contenu des articles, génère les résumés, écrit les artefacts, puis renvoie le digest sur Telegram.

J'ai aussi gardé la persistance simple et transparente. Au lieu d'ajouter une base de données, les sorties sont stockées en fichiers dans le repository :

- `data/sources/YYYY-MM-DD/` pour les résumés réussis
- `data/failed/YYYY-MM-DD/` pour les éléments en échec
- `data/digests/YYYY-MM-DD.md` pour le digest final
- `state.json` pour l'offset de polling Telegram

Cela rend chaque exécution facile à inspecter et à comprendre dans le temps. Chaque jour laisse une trace lisible.

## Des compromis assumés

Certains choix ne sont pas spectaculaires, mais ils collent mieux au besoin que des alternatives plus lourdes. Le polling plutôt que les webhooks évite un endpoint toujours actif et réduit la charge opérationnelle. Un modèle batch quotidien suffit ici et évite une complexité temps réel qui apporte peu de valeur.

La gestion des échecs est isolée : si une URL échoue pendant l'extraction ou le résumé, l'exécution continue et livre quand même un digest avec les entrées valides.

Ce comportement compte plus qu'un taux de succès parfait sur chaque élément. Le système reste utile même quand la qualité des entrées varie.

## Première utilisation de GSD

Ce projet est aussi ma première utilisation concrète de [GSD](https://github.com/gsd-build/get-shit-done/). Le point important, c'est que l'outil n'a pas pris les décisions d'architecture à ma place. Il a renforcé les décisions déjà claires (scope, contraintes, compromis) et a rendu visibles les zones floues quand elles existaient.

Dans la pratique, il m'a aidé à garder une exécution structurée : des unités de travail plus petites, une intention explicite et des itérations plus propres. Une livraison plus rapide, avec moins de détours inutiles.

`tldr-bot` est un petit système, mais il reflète la façon dont j'aime construire en général : un périmètre clair, des choix assumés, des sorties observables et une exécution prévisible. Garder une complexité proportionnelle à la valeur permet de garder une livraison fiable.
