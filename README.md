# 🎬 VideoMaker Script - Démarrage Rapide

## 📦 Contenu du package

```
📁 VideoMaker Script/
├── 📄 video-script-app.jsx       ← Composant React principal
├── 📖 GUIDE_COMPLET.md           ← Documentation complète
├── 🔧 CONFIG_AVANCEE.md          ← Configuration pour développeurs
├── 📝 exemple_script.txt         ← Script d'exemple à tester
└── 📋 README.md                  ← Ce fichier
```

---

## ⚡ Démarrage en 3 étapes

### 1️⃣ Obtenir une clé API Pexels (2 min)

1. Allez sur https://www.pexels.com/api/
2. Créez un compte (ou connectez-vous)
3. Créez une nouvelle clé API
4. Copiez la clé (vous l'utiliserez tout de suite)

### 2️⃣ Utiliser l'application web (directement)

L'application est prête à l'emploi ! Il y a deux façons de l'utiliser :

**Option A : Copier le code dans Claude.ai**
- Ouvrez https://claude.ai
- Cliquez sur "+" pour créer une nouvelle conversation
- Collez ce prompt dans Claude :

```
Crée un artifact React avec ce code :
[Copiez le contenu de video-script-app.jsx ici]
```

**Option B : Héberger localement avec Vite (5 min)**

```bash
# 1. Créer un nouveau projet Vite
npm create vite@latest videomaker -- --template react
cd videomaker

# 2. Remplacer le contenu de src/App.jsx par video-script-app.jsx

# 3. Installer les dépendances
npm install lucide-react

# 4. Lancer le serveur de développement
npm run dev

# 5. Ouvrir http://localhost:5173
```

### 3️⃣ Tester avec l'exemple fourni

1. Ouvrez l'application
2. Cliquez sur "Fichier" et sélectionnez `exemple_script.txt`
3. Entrez votre clé API Pexels quand demandé
4. Cliquez sur "Analyser"
5. Attendez la détection des scènes et des vidéos
6. Téléchargez les vidéos que vous aimez

---

## 🎯 Ce que l'app fait

### ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 📝 **Import Script** | Collez du texte ou chargez un fichier |
| 🎬 **Détection Scènes** | Reconnaît automatiquement SCENE 1, SCENE 2, etc. |
| 🤖 **IA Keywords** | Claude génère les meilleurs mots-clés |
| 🔍 **API Pexels** | Cherche les vidéos stock correspondantes |
| ⬇️ **Téléchargement** | Récupère les vidéos en un clic |
| 📊 **Dashboard** | Suivi en temps réel du traitement |

### 📊 Exemple de flux

```
Votre script (8 scènes)
         ↓
    Détection (instant)
         ↓
Extraction keywords (15 secondes)
         ↓
Recherche vidéos (20 secondes)
         ↓
Télécharger 40 vidéos
         ↓
Prêt pour montage ! 🎞️
```

---

## 📋 Format de script accepté

### Format optimal
```
SCENE 1
Description détaillée de la première scène.

SCENE 2
Description détaillée de la deuxième scène.

SCENE 3
Et ainsi de suite...
```

### Ce qui marche aussi
- `SCÈNE 1` (français)
- `Scene 1` (anglais)
- Ou juste des paragraphes séparés

---

## 🚀 Cas d'usage

✅ **Vidéos de présentation** - Trouver des vidéos pour votre pitch deck

✅ **Montages créatifs** - Illustrer un concept avec des vidéos pertinentes

✅ **Contenu YouTube** - Accélérer le processus de recherche de ressources

✅ **Films / Courts-métrages** - Compléter votre script avec des plans stock

✅ **Marketing vidéo** - Créer des vidéos promotionnelles rapidement

---

## 💡 Conseils pour les meilleurs résultats

### Script Description
```
❌ MAUVAIS  : "Une femme marche"
✅ BON      : "Une femme en tenue formelle marche rapidement dans un bureau moderne"
```

Plus votre script est détaillé, meilleures seront les vidéos trouvées !

### Mots-clés
L'IA génère automatiquement les meilleurs mots-clés, mais vous pouvez vérifier :
- Sont-ils en anglais ? (Pexels est mieux indexé en anglais)
- Sont-ils spécifiques ? (pas juste "vidéo")
- Correspondent-ils à votre vision ? (modifiez votre script si besoin)

### Résolution vidéo
- Cherchez **1080p minimum** pour YouTube
- **2K/4K** si vous avez un stockage de folie
- Les vidéos Pexels sont généralement en haute qualité

---

## 🔑 Gestion de la clé API Pexels

### Où la stocker
- **En local** : Dans un `.env` si vous hébergez vous-même
- **Jamais** : Ne la commitez pas sur GitHub
- **En production** : Utilisez un backend pour cacher la clé

### Limites de quota
- **200 requêtes/heure** (gratuit)
- **2000 requêtes/jour**
- = Environ 40 scènes par jour en recherche intensive

### Augmenter le quota
Si vous avez besoin de plus, contactez Pexels pour un compte business.

---

## 🛠️ Configuration Avancée

Pour les développeurs voulant personnaliser :

**Voir `CONFIG_AVANCEE.md`** pour :
- Ajouter un backend Node.js
- Déployer sur Vercel/Netlify/Heroku
- Intégrer avec Adobe Premiere ou DaVinci Resolve
- Ajouter du caching et de la persistance
- Implémenter l'authentification
- Et bien plus...

---

## ⚠️ Limitations actuelles

| Limite | Valeur |
|--------|--------|
| Scènes par import | 10 max |
| Mots-clés par scène | 5 max |
| Vidéos par résultat | 5 par scène |
| Durée script | 5000 caractères |
| Format fichier | .txt, .md, .pdf |

*Ces limites peuvent être augmentées selon vos besoins*

---

## 🆘 Troubleshooting

### Q: Les vidéos ne s'affichent pas
**A:** 
1. Vérifiez que votre clé API est correcte
2. Testez votre clé sur https://www.pexels.com/api/
3. Assurez-vous que vous avez au moins 200 requêtes restantes

### Q: Les mots-clés ne correspondent pas
**A:**
1. Rendez votre script plus descriptif
2. Utilisez des termes en anglais plutôt qu'en français
3. Testez avec des mots simples ("nature", "city", "office")

### Q: Le téléchargement ne marche pas
**A:**
1. Vérifiez votre connexion Internet
2. Assurez-vous que votre navigateur n'a pas bloqué le téléchargement
3. Essayez un autre navigateur

### Q: Application lente
**A:**
C'est normal ! Chaque requête Pexels prend 2-4 secondes. Soyez patient.

---

## 📚 Lectures recommandées

| Sujet | Lien |
|-------|------|
| Pexels API | https://www.pexels.com/api/documentation/ |
| Guide complet | Voir `GUIDE_COMPLET.md` |
| Config avancée | Voir `CONFIG_AVANCEE.md` |

---

## 📝 Licence

Les vidéos Pexels sont **libres d'utilisation commerciale** 🎉

BUT vous devez :
- ✅ Créditer les auteurs Pexels (généralement dans les crédits de fin)
- ✅ Respecter les conditions d'utilisation Pexels
- ✅ Ne pas revendre les vidéos directement

> L'app vous montre automatiquement le nom du photographe pour vous aider à les créditer !

---

## 🎓 Prochaines étapes

1. **Testez** l'app avec l'exemple fourni
2. **Découvrez** les vidéos Pexels disponibles
3. **Créez** votre propre script
4. **Montez** vos vidéos dans votre logiciel préféré
5. **Partagez** votre création ! 🚀

---

## 💬 Questions ?

Consultez :
- 📖 `GUIDE_COMPLET.md` pour les questions générales
- 🔧 `CONFIG_AVANCEE.md` pour les questions techniques
- 🌐 https://help.pexels.com/ pour les questions Pexels

---

**Bon montage ! 🎬✨**
