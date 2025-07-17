/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   envvar.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mmacia <marvin@42.fr>                      +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/23 15:21:14 by mmacia            #+#    #+#             */
/*   Updated: 2024/07/23 15:21:17 by mmacia           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#include "../header/minishell.h"

void	environnement_var(char *input, t_env_var *envvar, bool global)
{
	int	i;

	i = 0;
	while (input[i] && input[i] != '=')
		i++;
	set_var(envvar, ft_substr(input, 0, i),
		ft_substr(input, i + 1, ft_strlen(input) - i - 1), global);
}

t_env_var	*init_envvar(void)
{
	t_env_var	*envvar;

	envvar = malloc(sizeof(t_env_var));
	if (!envvar)
		return (NULL);
	envvar->key = NULL;
	envvar->value = NULL;
	envvar->next = NULL;
	return (envvar);
}

t_env_var	*last_node(t_env_var *init_envvar)
{
	while (init_envvar && init_envvar->next)
		init_envvar = init_envvar->next;
	return (init_envvar);
}

void	add_node(t_env_var *init_envvar, char *key, char *value, bool global)
{
	t_env_var	*new_node;

	new_node = malloc(sizeof(t_env_var));
	new_node->key = key;
	new_node->value = value;
	new_node->next = NULL;
	new_node->global = global;
	last_node(init_envvar)->next = new_node;
}
