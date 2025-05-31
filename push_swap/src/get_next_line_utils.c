/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line_utils.c                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

char	*ft_dupafter(char *src)
{
	char	*dup;
	int		i;
	int		ls;

	i = 0;
	ls = ftr_strlen(src);
	dup = (char *)malloc((sizeof(char)) * (ls + 1));
	if (dup == NULL)
		return (NULL);
	while (src[i] != '\0')
	{
		dup[i] = src[i];
		i++;
	}
	dup[i] = '\0';
	free(src);
	return (dup);
}

char	*ft_dup(char *src, int fin)
{
	int		i;
	char	*dup;

	i = 0;
	dup = NULL;
	if (ftr_strlen(src) == 0)
		return (free(src), NULL);
	if (src[fin] == '\n')
		dup = (char *)malloc(sizeof(char) * (fin + 2));
	else if (src[fin] == '\0')
		dup = (char *)malloc(sizeof(char) * (ftr_strlen(src) + 1));
	if (dup == NULL)
		return (free(src), NULL);
	while (src[i] != '\0' && src[i] != '\n')
	{
		dup[i] = src[i];
		i++;
	}
	if (src[i] == '\n')
		dup[i++] = '\n';
	dup[i] = '\0';
	free(src);
	return (dup);
}

int	ftr_strlen(char *s)
{
	int	i;

	i = 0;
	if (s == NULL || s[i] == '\0')
		return (0);
	while (s[i] != '\0')
		i++;
	return (i);
}

char	*f_strjoin(char *s1, char *s2)
{
	unsigned int	i;
	unsigned int	j;
	char			*dup;

	i = 0;
	j = 0;
	dup = (char *)malloc(sizeof(char) * (ftr_strlen(s1) + ftr_strlen(s2) + 1));
	if (dup == NULL)
		return (free(s1), NULL);
	while (s1[i] != '\0')
	{
		dup[i] = s1[i];
		i++;
	}
	while (s2[j] != '\0')
	{
		dup[i] = s2[j];
		i++;
		j++;
	}
	dup[i] = '\0';
	free(s1);
	return (dup);
}

char	*ft_join(char *stock, char *buffer)
{
	char	*temp;

	temp = f_strjoin(stock, buffer);
	free(buffer);
	return (temp);
}
