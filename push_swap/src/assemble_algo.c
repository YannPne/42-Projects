/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   assemble_algo.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ypanares <ypanares@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/02/05 10:51:19 by ypanares          #+#    #+#             */
/*   Updated: 2024/02/07 09:10:30 by ypanares         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../headers/push_swap.h"

void	ft_startalgo(t_list **a, int size)
{
	t_list	**b;
	t_list	*nulos;

	b = &nulos;
	nulos = NULL;
	if (ft_checkordre(a) == 0)
		return ;
	ft_videa(a, b, size, size / 2);
	ft_three(a);
	ft_middlealgo(a, b);
	if (ft_checkordre(a) == 1)
		ft_align(a);
}

void	assemble_pos(t_list **a, t_list **b)
{
	t_list	*tampon;

	tampon = NULL;
	poslist(b, 0, ft_size(b), 0);
	poslist(a, 1, ft_size(a), 0);
	checkplage(a, b, tampon);
	checkcostb(b);
}

void	ft_middlealgo(t_list **a, t_list **b)
{
	int		i;

	while (*b != NULL)
	{
		assemble_pos(a, b);
		i = choicenode(b, 0);
		assemble_algo(a, b, i);
		ft_pa(a, b);
	}
}

void	assemble_algo(t_list **a, t_list **b, int i)
{
	t_list	*tempb;

	tempb = *b;
	while (i != 0)
	{
		tempb = tempb->next;
		i--;
	}
	ft_ifrrr(a, b, tempb);
	ft_exclista(a, tempb);
	ft_exclistb(b, tempb);
}
