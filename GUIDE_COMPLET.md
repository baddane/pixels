# 🎬 VideoMaker Script - Guide Complet

## 📋 Vue d'ensemble

VideoMaker Script est une application automatisée qui transforme votre script vidéo en vidéos stock prêtes à utiliser. Elle combine l'IA pour l'extraction de mots-clés avec l'API Pexels pour trouver et télécharger les vidéos idéales.

### Fonctionnalités principales :
✅ **Importation de script** - Collez du texte ou chargez un fichier (.txt, .md, .pdf)
✅ **Détection automatique des scènes** - Reconnaît les numéros de scène (SCENE 1, SCÈNE 2, etc.)
✅ **Extraction IA des mots-clés** - Claude génère automatiquement les termes de recherche
✅ **Recherche Pexels** - Intégration avec l'API Pexels pour les vidéos stock gratuits
✅ **Téléchargement en un clic** - Récupérez directement les vidéos

---

## 🚀 Installation & Configuration

### Prérequis
- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- Une clé API **Pexels** gratuite
- Une connexion Internet stable

### Obtenir une clé API Pexels (gratuit)

1. Allez sur https://www.pexels.com/api/
2. Cliquez sur "Create Account" (ou connectez-vous si vous avez déjà un compte)
3. Une fois authentifié, cliquez sur "Create a new API key"
4. Acceptez les conditions d'utilisation
5. Copiez votre clé API

> **💡 Conseil** : Une clé API Pexels gratuite vous permet de faire **200 requêtes par heure**. Idéal pour les projets de petite à moyenne envergure.

### Configuration de l'application

1. **Lancez l'app** - L'application s'ouvre automatiquement avec une modal pour la clé API
2. **Entrez votre clé API Pexels** - Collez-la dans le champ "Votre clé API Pexels"
3. **Cliquez "Continuer"** - La clé est sauvegardée dans votre session

---

## 📝 Format du Script

L'application reconnaît deux formats de script :

### Format Standard (Recommandé)
```
SCENE 1
Une jeune femme se réveille dans un appartement minimaliste.
Elle regarde par la fenêtre vers la ville qui s'éveille.

SCENE 2
Plans extérieurs de la métropole au lever du soleil.
Des voitures roulent sur les avenues principales.

SCENE 3
Retour à l'intérieur. La femme prépare son café.
Elle contemple une photo sur le mur.
```

### Format Simple (Alternative)
Si votre script n'a pas de balises SCENE, l'application divise automatiquement par paragraphes.

### Caractères acceptés
- ASCII standard (anglais, français, espagnol, etc.)
- Caractères spéciaux courants
- Jusqu'à 10 scènes maximum (par souci de performance)

---

## 🎯 Mode d'emploi pas à pas

### Étape 1 : Importation du Script

**Option A - Copier/coller direct**
1. Ouvrez l'application
2. Collez votre script dans la zone "Script" à gauche
3. Appuyez sur "Analyser"

**Option B - Charger un fichier**
1. Cliquez sur le bouton "Fichier"
2. Sélectionnez un fichier .txt, .md ou .pdf
3. Le contenu s'affiche automatiquement
4. Appuyez sur "Analyser"

### Étape 2 : Analyse du Script

Quand vous appuyez sur "Analyser" :

1. **Détection des scènes** (instant)
   - L'application identifie les scènes numérotées
   - Chaque scène est affichée dans le panneau de droite

2. **Extraction des mots-clés** (2-3 secondes par scène)
   - Status : "Extraction"
   - Claude analyse chaque scène et génère 3-5 mots-clés pertinents
   - Les mots-clés s'affichent sous la description

3. **Recherche de vidéos** (3-4 secondes par scène)
   - Status : "Recherche"
   - L'API Pexels cherche les vidéos correspondant aux mots-clés
   - Jusqu à 5 vidéos par scène

4. **Résultats prêts** (instantané)
   - Status : "Prêt" ✓
   - Les vidéos trouvées s'affichent
   - Vous pouvez télécharger

---

## 💾 Téléchargement des Vidéos

### Télécharger une vidéo individuelle

1. Trouvez la vidéo que vous voulez dans la liste
2. Cliquez sur l'icône **⬇️** (Télécharger)
3. La vidéo se télécharge dans votre dossier Téléchargements
4. Nomme automatiquement : `scene_X_videoid.mp4`

### Où trouvent les vidéos ?
- **Windows** : `C:\Users\[Utilisateur]\Téléchargements\`
- **Mac** : `~/Téléchargements/`
- **Linux** : `~/Téléchargements/`

### Informations vidéo affichées
- **Durée** (en secondes) : 5s, 10s, 30s, etc.
- **Résolution** (en pixels) : 1080p, 2K, 4K, etc.
- **Crédit** (photographe) : Nom de l'auteur Pexels

---

## 🔧 Personnalisation Avancée

### Ajuster les mots-clés manuellement

Si les mots-clés extraits ne vous conviennent pas :
1. Modifiez manuellement le script
2. Ajoutez des détails plus spécifiques
3. Relancez l'analyse

**Exemple** :
- ❌ Mauvais : "Un homme marche"
- ✅ Bon : "Un homme en costume marche dans les rues de New York au coucher du soleil"

### Importer depuis d'autres sources

L'app accepte les fichiers `.txt`, `.md`, `.pdf`. Vous pouvez convertir votre script depuis :
- **Google Docs** : Fichier → Télécharger → Au format .txt
- **Microsoft Word** : Enregistrer sous → Format .txt
- **Final Draft** : Exporter → Format texte simple

---

## 🎬 Cas d'usage pratiques

### 1. Court-métrage d'une minute
```
- 5-8 scènes
- 2-3 mots-clés par scène
- Temps total : ~3 minutes
```

### 2. Vidéo de présentation produit
```
- 10-12 scènes
- Focus sur la démonstration
- Besoin de gros plans et détails techniques
```

### 3. Montage drone / aérien
```
- Mots-clés : "aerial", "drone", "cityscape"
- Cherchez les vidéos en haute résolution
- Pexels propose d'excellentes vidéos de drone gratuites
```

### 4. Clip musical
```
- Synchronisez les mots-clés avec le rythme
- Cherchez des vidéos dynamiques pour les moments forts
- Les transitions devraient être courtes (< 5 secondes)
```

---

## ⚙️ Troubleshooting

### L'API Pexels retourne 0 résultats

**Causes possibles** :
- Les mots-clés générés ne correspondent pas à votre besoin
- Pexels n'a pas de vidéo pour cette combinaison de termes

**Solutions** :
1. Écrivez votre script avec plus de détails descriptifs
2. Essayez des termes anglais (Pexels est mieux indexé en anglais)
3. Vérifiez que votre clé API est active

### Erreur "Clé API invalide"

1. Vérifiez le format de votre clé sur pexels.com
2. Assurez-vous que vous n'avez pas d'espaces superflus
3. Testez votre clé sur https://www.pexels.com/api/documentation/

### Fichier .pdf ne charge pas

Si l'import de PDF échoue :
1. Convertissez en .txt avec un outil PDF-to-text en ligne
2. Ou copiez/collez le contenu directement

### Application lente

Pexels a un délai de réponse parfois lent :
- Normal : 2-4 secondes par requête
- C'est pour respecter leurs limites de taux
- Soyez patient, ne fermez pas l'onglet

---

## 📊 Limites et Quotas

| Élément | Limite |
|---------|--------|
| Scènes par import | 10 max |
| Mots-clés par scène | 5 max |
| Vidéos par scène | 5 résultats |
| Requêtes API Pexels/heure | 200 (clé gratuite) |
| Durée max script | 5000 caractères |
| Résolution max vidéo | 4K (si dispo) |

---

## 🌐 Ressources Utiles

- **Pexels API Docs** : https://www.pexels.com/api/documentation/
- **Bibliothèque Pexels** : https://www.pexels.com/search/
- **FAQ Pexels** : https://help.pexels.com/

---

## 💡 Conseils Pro

### Pour les meilleurs résultats :

1. **Soyez descriptif dans votre script**
   - Inclure la moindre des couleurs, lumière, action
   - Les mots-clés seront plus pertinents

2. **Testez d'abord en anglais**
   - Pexels a plus de vidéos pour les requêtes anglaises
   - Utilisez des termes simples et universels

3. **Optimisez la durée**
   - Cherchez des vidéos plus courtes (5-15 secondes)
   - Plus faciles à intégrer dans le montage

4. **Conservez les fichiers**
   - Organisez vos téléchargements par projet
   - Créez un dossier "Vidéos_Scènes" pour rester organisé

5. **Explorez les alternatives**
   - Si une scène n'a pas de bons résultats, testez différents mots-clés
   - Essayez "nature", "urban", "abstract", etc.

---

## ✅ Checklist avant de monter

- [ ] Tous les fichiers vidéo téléchargés ?
- [ ] Vidéos organisées par scène ?
- [ ] Résolution cohérente (1080p, 2K, 4K) ?
- [ ] Durée suffisante pour le montage ?
- [ ] Crédits des auteurs notés (pour légalité) ?

**Important** : Les vidéos Pexels nécessitent une attribution. Incluez les noms des photographes/auteurs dans votre générique.

---

## 🤝 Support & Feedback

Si vous rencontrez un problème :
1. Vérifiez les paramètres API
2. Testez la clé sur pexels.com/api
3. Essayez un autre navigateur
4. Videz le cache et réessayez

Bon montage ! 🎞️
