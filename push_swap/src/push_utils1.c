/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   push_utils1.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

char	**ft_duparg(int argc, char **argv)
{
	char	**duptab;
	int		i;
	int		j;

	i = 1;
	j = 0;
	duptab = (char **)malloc((sizeof (char *)) * (argc));
	if (duptab == NULL)
		return (NULL);
	while (i != argc)
	{
		duptab[j] = ft_strdup(argv[i]);
		i++;
		j++;
	}
	duptab[j] = NULL;
	return (duptab);
}

char	*ft_strdup(char *s)
{
	char	*dup;
	int		i;
	int		ls;

	i = 0;
	ls = ft_strlen(s);
	dup = (char *)malloc((sizeof(char)) * (ls + 1));
	if (dup == NULL)
		return (NULL);
	while (s[i] != '\0')
	{
		dup[i] = s[i];
		i++;
	}
	dup[i] = '\0';
	return (dup);
}

long long	ft_atoi(char *ptr)
{
	int			i;
	long long	result;
	int			sign;

	i = 0;
	result = 0;
	sign = 1;
	while ((ptr[i] >= 9 && ptr[i] <= 13) || ptr[i] == 32)
		i++;
	if (ptr[i] == '+' || ptr[i] == '-')
	{
		if (ptr[i] == '-')
			sign = sign * -1;
		i++;
	}
	while (ptr[i] != '\0' && (ptr[i] >= 48 && ptr[i] <= 57))
	{
		result = result * 10 + (ptr[i] - '0');
		i++;
	}
	return (result * sign);
}

int	ft_strlen(char	*c)
{
	int	i;

	i = 0;
	while (c[i] != '\0')
		i++;
	return (i);
}

void	ft_indexation(t_list **li)
{
	t_list	*temp;
	t_list	*first;

	first = *li;
	while (first != NULL)
	{
		temp = *li;
		while (temp != NULL)
		{
			if (first->content > temp->content)
				first->index++;
			temp = temp->next;
		}
		first = first->next;
	}
}
