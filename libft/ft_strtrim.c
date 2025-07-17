/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strtrim.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <marvin@42.fr>                    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/03 17:15:26 by ypanares          #+#    #+#             */
/*   Updated: 2023/10/03 17:36:56 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

int	set_deb(const char *str, char const *set)
{
	int	i;
	int	e;
	int	boolean;

	boolean = 1;
	e = 0;
	i = 0;
	while (str[i] && boolean)
	{
		e = 0;
		boolean = 0;
		while (set[e])
			if (set[e++] == str[i])
				boolean = 1;
		i++;
	}
	return (i - 1);
}

int	set_fin(const char *str, char const *set, int len)
{
	int	i;
	int	boolean;

	boolean = 1;
	while (len && boolean)
	{
		i = 0;
		boolean = 0;
		while (set[i])
			if (set[i++] == str[len])
				boolean = 1;
		len--;
	}
	return (len + 2);
}

char	*empty_string(void)
{
	char	*str;

	str = malloc(sizeof(char));
	if (!str)
		return (NULL);
	ft_strlcpy(str, "", 1);
	return (str);
}

char	*ft_strtrim(char const *s1, char const *set)
{
	char	*trim;
	int		i;
	int		e;
	int		len_set;

	len_set = ft_strlen(set);
	i = set_deb(s1, set);
	e = ft_strlen(s1);
	if (!s1)
		return (NULL);
	if (i + 1 == e)
		return (empty_string());
	e = set_fin(s1, set, e - 1);
	trim = malloc((e - i + 1) * sizeof(char));
	if (!trim)
		return (NULL);
	len_set = 0;
	while (i < e)
	{
		trim[len_set] = s1[i];
		len_set++;
		i++;
	}
	trim[len_set] = '\0';
	return (trim);
}
