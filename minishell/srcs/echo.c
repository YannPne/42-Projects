/* ************************************************************************** */
/*																			*/
/*														:::	  ::::::::   */
/*   instructions2.c									 :+:	 :+:	:+:   */
/*													+:+ +:+		 +:+	 */
/*   By: mmacia <marvin@42.fr>					  +#+  +:+	   +#+		*/
/*												+#+#+#+#+#+   +#+		   */
/*   Created: 2024/07/23 16:08:02 by mmacia			#+#	#+#			 */
/*   Updated: 2024/07/23 16:08:04 by mmacia		   ###   ########.fr	   */
/*																			*/
/* ************************************************************************** */
#include "../header/minishell.h"

char	*echo_str_in_var(t_env_var *env, char *input, int len)
{
	char	*key_name;
	int		i;
	int		retour_l;

	i = 4;
	retour_l = 0;
	while (input[++i] && !ft_isalpha(input[i]))
	{
		if (input[i] == '-' && input[i + 1] && input[i + 1] == 'n')
		{
			retour_l = 1;
			i += 3;
			if (input[i - 1] && input[i - 1] != ' ')
				break ;
		}
		if (input[i] == '$')
		{
			i++;
			while (input[i + len] && ft_isalpha(input[i + len]))
				len++;
			break ;
		}
	}
	key_name = calloc(len + 2 - retour_l, sizeof(char));
	return (echo_str_in_var2(env, input, retour_l, key_name));
}

void	echo_str2(char *mot, char *m, int retour_l, int e)
{
	t_poubelle	v;

	v.i = param_echo(&v.s_q, &v.d_q, m, 5) + retour_l - 1;
	while (m[++(v.i)])
	{
		if (!v.s_q && !v.d_q && (!metacaractere(m[v.i]) || m[v.i] == '$'))
			mot[e++] = m[v.i];
		else if (v.s_q && m[v.i] != '\'' && (ft_isalnum(m[v.i])
				|| metacaractere(m[v.i]) || m[v.i] == ' '))
			mot[e++] = m[v.i];
		else if (v.d_q && m[(v.i)] && m[v.i] != '\"' && (ft_isalnum(m[v.i])
				|| metacaractere(m[v.i]) || m[v.i] == ' '))
			mot[e++] = m[v.i];
		if (m[v.i - 1] && (m[v.i] == '\''
				|| m[v.i] == '\"') && ft_isalnum(m[v.i - 1]))
		{
			while (m[v.i + 1] && (m[v.i] == '\'' || m[v.i] == '\"'))
				(v.i)++;
			while (m[v.i] && !(m[v.i] == '\'' || m[v.i] == '\"'))
				mot[e++] = m[(v.i)++];
			if ((int)ft_strlen(m) > v.i + 2)
				param_echo(&v.s_q, &v.d_q, m, v.i);
		}
	}
	mot[e] = '\0';
}

char	*echo_str(t_env_var *env, char *input, int i, int retour_l)
{
	char	*mot;

	if (strlen(input) < 4)
		return ("\n");
	while (input[i] && input[i] == ' ')
		i++;
	if (input[i] == '-' && input[i + 1] == 'n' && input[i + 2] == ' ')
	{
		retour_l = 3;
		i += 2;
		if (input[i] && input[i] != ' ')
			i = strlen(input);
	}
	while (input[i] && !ft_isalpha(input[i]))
	{
		if (input[i] == '$' && input[i + 1] && input[i + 1] == '?')
			return (retour_ligne("0", retour_l));
		if (input[i] == '$' && input[i + 1]
			&& ft_isalnum(input[i + 1]) && input[i - 1] != '\'')
			return (echo_str_in_var(env, input, 0));
		i++;
	}
	mot = malloc(sizeof(char) * 1200);
	echo_str2(mot, input, retour_l, 0);
	return (retour_ligne(mot, retour_l));
}

void	echo(t_env_var *env, char *input, char *s_parsing)
{
	char	*mot;

	if (s_parsing && *s_parsing != '\000')
		meta_echo(env, input, s_parsing);
	else
	{
		mot = echo_str(env, input, 5, 0);
		printf("%s", mot);
		if (mot && *mot)
			free(mot);
		else
			printf("\n");
	}
}
