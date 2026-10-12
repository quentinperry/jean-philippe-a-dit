// Quiz « Jean-Philippe a-t-il dit ça ? » : une vraie citation, trois impostures.
(function () {
  window.QUIZ_DATA = [
    {
      real: "Ne pas faire le poulet",
      fakes: [
        "Ne pas avoir l'air d'un gorille à la brasserie",
        "Ne pas pouliner avant le dernier accord",
        "Ne pas sourire comme un mariage raté"
      ]
    },
    {
      real: "Vous aviez l'enthousiasme d'une vache qui regarde la fin du train passer",
      fakes: [
        "Vous aviez la grâce d'un sas de piscine un dimanche de pluie",
        "Vous aviez l'élan d'un fauteuil à la salle d'attente du dentiste",
        "Vous aviez la passion d'un parcmètre en panne le jour férié"
      ]
    },
    {
      real: "Chuchotez, ça fait secte, c'est très bien",
      fakes: [
        "Chantez faux, ça fait humain, j'adore ça",
        "Plaignez-vous, ça fait artiste, continuez",
        "Voyagez en pensée, ça fait intellectuel, parfait"
      ]
    },
    {
      real: "Un accent, ce n'est pas quelque chose qu'on appuie, mais quelque chose qu'on soulève",
      fakes: [
        "Un accent, c'est comme un cache-pot : ça doit reposer quelque chose de vivant",
        "Un accent, c'est une baguette de chef qui ne toucherait jamais l'orchestre",
        "Un accent, c'est l'arôme du morceau : trop de vanille et on n'a plus de dessert"
      ]
    },
    {
      real: "Rangez-moi ces téléphones portables ou je vous mords",
      fakes: [
        "Le prochain qui baille, je le coupe du solo",
        "Je vais finir par louer des taxis pour vous faire répéter à l'heure",
        "Celui qui chuchote encore, je le nomme président du chœur"
      ]
    },
    {
      real: "Faites sonner le « V » comme un bout de plastique sur un ventilateur",
      fakes: [
        "Faites sonner le « V » comme une barque amarrée un soir d'été",
        "Faites le « V » comme un stylo bureaucrate qui signe sans lire",
        "Faites ce « V » comme un escalier roulant aux Galeries Lafayette"
      ]
    },
    {
      real: "Là, ce doit être pianississimo ! Bon, les alti, vous pouvez y aller forte",
      fakes: [
        "Là, tout doit être dentelle ! Bon, les basses, ne me faites pas peur",
        "Là, on doit frôler le silence ! Bon, les sopranes, éclatez-vous",
        "Là, je veux du velours ! Bon, les ténors, soyez des tapis"
      ]
    },
    {
      real: "Je ne suis pas contre la violence",
      fakes: [
        "La douceur, c'est pour les gens qui n'ont pas de tempo",
        "Un chef sans ennemis n'a pas de carrière",
        "Il faut parfois hurler avec les loups pour être entendu des agneaux"
      ]
    },
    {
      real: "Vous êtes farces tout de même !",
      fakes: [
        "Vous êtes des phonographes fatigués !",
        "Vous êtes des parapluies retournés dans un salon !",
        "Vous êtes des meringues un jour de canicule !"
      ]
    },
    {
      real: "Mozart quand il a écrit ça, il ne regardait pas BFM Business",
      fakes: [
        "Verdi n'écrivait pas ses requiem en écoutant la météo des plages",
        "Bach n'a jamais composé entre deux publicités de yaourt",
        "Haendel ne vérifiait pas ses airs sur les réseaux sociaux"
      ]
    },
    {
      real: "Faire n'importe quoi, ce n'est pas être libre, c'est être dingue",
      fakes: [
        "L'indiscipline, ce n'est pas de la spontanéité, c'est du vandalisme",
        "Se laisser aller, ce n'est pas de la sagesse, c'est de la rouille",
        "Improviser sans savoir, ce n'est pas du talent, c'est de la loterie"
      ]
    },
    {
      real: "N'ayez pas une respiration étriquée, ayez une respiration royale",
      fakes: [
        "Ne respirez pas comme un locataire, respirez comme un propriétaire",
        "Votre souffle doit être un bal expérimental, pas une salle d'attente",
        "Respirez comme si les Habsbourg vous regardaient depuis le balcon"
      ]
    },
    {
      real: "Vous y penserez, le jour du concert, que je vous ai traités de mulets",
      fakes: [
        "Le jour du concert, vous regretterez ces raviolis que je vous ai servis",
        "Vous vous souviendrez du concert que je vous ai fait ranger comme du linge",
        "Le soir de la première, vous m'écrivez une lettre pour ces klaxons"
      ]
    },
    {
      real: "Il faut jouer sa vie sur chaque note !",
      fakes: [
        "Chaque silence doit vous coûter une nuit blanche !",
        "Il faut parier son mois de salaire sur chaque mesure !",
        "Il faut disparaître dans chaque note comme un magicien dans son chapeau !"
      ]
    },
    {
      real: "Moi ce que j'entends, ce sont les hommes du XXIe siècle qui se font complètement bouffer par les femmes",
      fakes: [
        "Ce que j'entends, c'est la joie de vivre des machines à laver du siècle dernier",
        "Moi j'entends des chanteurs du dimanche qui ont peur de leur propre télévision",
        "Ce que je perçois, c'est la nostalgie d'une époque où l'on aimait les accordéons"
      ]
    },
    {
      real: "C'est un motif de gazelle, pas d'hippopotame !",
      fakes: [
        "C'est une arabesque de dentelle, pas de tôle ondulée !",
        "C'est une phrase de soie, pas de béton armé !",
        "Ce mouvement-là, c'est du papier de soie, pas du carrelage !"
      ]
    },
    {
      real: "C'est vrai que ce que je dis est toujours très bien",
      fakes: [
        "Il faut reconnaître que je n'ai jamais eu tort depuis 1987",
        "Admettez que mes phrases mériteraient des médailles olympiques",
        "On me le dit souvent : je parle comme un dictionnaire illustré"
      ]
    },
    {
      real: "Je prends les ténors dans les toilettes. Le vestiaire, pardon. Vous allez voir, ça va bien se passer.",
      fakes: [
        "Les basses, on se retrouve au buffet de la gare. Le salon de thé, pardon.",
        "Les altis, je vous attendrai dans l'escalier de service. L'ascenseur, pardon.",
        "Les sopranes, rendez-vous à la cave. Le paradis, pardon."
      ]
    },
    {
      real: "Imaginez tous les morts depuis la nuit des temps qui sortent du tombeau",
      fakes: [
        "Imaginez tous les couscous de l'histoire refroidis en même temps",
        "Pensez à tous les parapluies abandonnés depuis la guerre qui s'ouvrent d'un coup",
        "Visualisez toutes les chaussettes perdues qui descendent vers vous"
      ]
    },
    {
      real: "Vous savez, quand le riz est trop cuit, il colle. Ne collez pas",
      fakes: [
        "Quand la confiture prend, elle refuse le pain. Ne refusez pas",
        "Un tapioca malheureux, ça fait des grumeaux. Ne grumelez pas",
        "La polenta quand elle refroidit devient un paysage. Ne devenez pas un paysage"
      ]
    },
    {
      real: "Il faut que ce soit hystérique : moins, ce sera merdique",
      fakes: [
        "Il faut du délire : en dessous, c'est de la confiture",
        "Je veux de la folie furieuse : sinon c'est de la salle d'attente",
        "Il me faut du vertige : moins, c'est du pop-corn sans sel"
      ]
    },
    {
      real: "Le cœur contrit comme des nanoparticules",
      fakes: [
        "Le cœur brisé comme des draps d'hôpital",
        "Le cœur confit comme des tomates du sud en été",
        "Le cœur ému comme des confettis de mariage"
      ]
    },
    {
      real: "Écoutez les violons, c'est comme des vaguelettes qui viennent lécher le Royaume-Uni",
      fakes: [
        "Écoutez les violons, c'est comme du beurre qui fond sur un toast d'Écosse",
        "Les altos, on dirait des ruisseaux qui bavardent avec la Belgique",
        "Entendez les violoncelles, c'est une marmaille qui chatouille l'Irlande"
      ]
    },
    {
      real: "Parlez sombrement, un peu comme un fantôme",
      fakes: [
        "Parlez chaudement, comme un chocolat de garde",
        "Parlez avec moquette, comme un grand-père en décembre",
        "Parlez en velours côtelé, comme un bibliothécaire en colère"
      ]
    },
    {
      real: "Cet accent, c'est pour faire peur à l'hiver",
      fakes: [
        "Cet accent-là, c'est pour réveiller les fleurs de printemps",
        "Ce fortissimo servira à faire fuir les moineaux du beffroi",
        "Cet accent, c'est un cache-nez pour les mois de novembre"
      ]
    },
    {
      real: "Avec nos mots, il faut faire des robes du XVIIIe siècle",
      fakes: [
        "Avec nos notes, il faut coudre des costumes de carnaval vénitiens",
        "Nos phrases doivent porter des gants de soie et rien d'autre",
        "Chaque mot doit avoir la coupe d'un costume de gala au Kiosque"
      ]
    },
    {
      real: "Bon, la fraternité... on a pas le même père, je ne sais pas ce que ça veut dire",
      fakes: [
        "L'égalité, très bien, mais on n'a pas tous le même dentiste",
        "La solidarité, parfait, mais on ne prend pas le même métro",
        "La liberté, certes, mais on n'a pas tous le même facteur"
      ]
    },
    {
      real: "N'hésitez pas à sentir bon en venant chanter",
      fakes: [
        "N'oubliez pas d'apporter un petit cadeaux au pupitre d'en face",
        "Pensez à repasser vos chemises avant le Dies Irae",
        "Je vous demande simplement de ne pas apporter de sandwichs au thon"
      ]
    },
    {
      real: "Le chœur, vous arrivez comme un gros paquebot dans la ville de Venise",
      fakes: [
        "Vous entrez dans ce morceau comme une délicate barquette de fruits de mer",
        "Le chœur doit surgir comme un dimanche pluvieux à Lourdes",
        "Vous déboulez dans la phrase comme une lessiveuse dans un salon Louis XV"
      ]
    },
    {
      real: "Est-ce que vous entendez le caractère maléfique de la voyelle « T » nasalisée ?",
      fakes: [
        "Avez-vous senti l'humilité secrète de la consonne « R » roulée à l'anglaise ?",
        "Entendez-vous la jalousie bourgeoise du diphtongue « oi » de « droit » ?",
        "Percevez-vous la mélancolie du « M » final quand il pense à dimanche ?"
      ]
    }
  ];
})();
