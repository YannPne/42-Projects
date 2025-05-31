/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_split.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 16:07:12 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/02 18:30:52 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

void	ft_strncpy(char *s1, char const *s2, int n)
{
	while (*s2 && n--)
	{
		*s1 = *s2;
		s1++;
		s2++;
	}
	*s1 = '\0';
}

int	count_words(char const *s, char c)
{
	int	i;
	int	nb_words;

	i = 0;
	nb_words = 0;
	while (s[i])
	{
		if (i == 0 && s[i] != c)
			nb_words++;
		else if (s[i] != c && s[i - 1] == c)
			nb_words++;
		i++;
	}
	return (nb_words);
}

char	**ft_split(char const *s, char c)
{
	int		i;
	int		j;
	int		nb_words;
	char	**split;

	split = malloc((count_words(s, c) + 1) * sizeof(char *));
	if (!split)
		return (NULL);
	i = -1;
	nb_words = 0;
	while (s[++i])
	{
		j = 0;
		while (s[i + j] && s[i + j] != c)
			j++;
		if (j > 0)
		{
			split[nb_words] = malloc((j + 1) * sizeof(char));
			ft_strncpy(split[nb_words], &s[i], j);
			nb_words++;
			i += j - 1;
		}
	}
	split[nb_words] = NULL;
	return (split);
}
