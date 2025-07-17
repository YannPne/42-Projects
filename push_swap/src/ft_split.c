/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_split.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

char	*ft_strncpy(char *dest, char *src, int n)
{
	int	i;

	i = 0;
	while (src[i] != '\0' && i < n)
	{
		dest[i] = src[i];
		i++;
	}
	dest[i] = '\0';
	return (dest);
}

int	countword(char const *s, char c)
{
	int	i;
	int	count;

	i = 0;
	count = 0;
	if (s[0] != c && s[0] != 34)
	{
		count++;
		while (s[i] != c && s[i] != 34 && s[i] != '\0')
			i++;
	}
	while (s[i] != '\0')
	{
		while (s[i] == c || s[i] == 34)
		{
			i++;
		}
		if (s[i] != c && s[i] != 34 && s[i] != '\0')
			count++;
		while (s[i] != c && s[i] != 34 && s[i] != '\0')
		{
			i++;
		}
	}
	return (count);
}

char	**tabc(char **tab, const char *s, char c)
{
	int	i;
	int	j;
	int	k;

	i = 0;
	k = 0;
	while (s[i] != '\0')
	{
		while ((s[i] != '\0') && (s[i] == c || s[i] == 34))
			i++;
		j = i;
		while (s[i] != '\0' && s[i] != c && s[i] != 34)
			i++;
		if (i > j)
		{
			tab[k] = (char *)malloc((sizeof(char)) * (i - j + 1));
			if (tab[k] == NULL)
				return (NULL);
			ft_strncpy(tab[k], (char *)&s[j], i - j);
			k++;
		}
	}
	return (tab);
}

char	**ft_split(char const *s, char c)
{
	int		i;
	char	**tabtab;

	if (s[0] == '\0' || s == NULL)
		return (ft_calloc(sizeof(char *), 1));
	i = countword(s, c);
	tabtab = (char **)malloc(((i + 1) * (sizeof (char *))));
	if (tabtab == NULL)
	{
		return (NULL);
	}
	tabtab = tabc(tabtab, s, c);
	tabtab[i] = NULL;
	return (tabtab);
}
